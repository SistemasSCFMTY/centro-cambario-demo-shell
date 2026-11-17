import { DIVISAS_CAJA } from '@data/constants/caja.constants';
import { CAJAS, EXISTENCIAS_CAJA } from '@data/fixtures/cajas.fixture';
import { CAJEROS } from '@data/fixtures/cajeros.fixture';
import { FECHA_BAJA_TIJUANA } from '@data/fixtures/auditoria.fixture';
import { OPERACIONES } from '@data/fixtures/operaciones.fixture';
import { Caja } from '@data/interfaces/caja';
import { ConteoCaja } from '@data/interfaces/conteo-caja';
import { ConteoMoneda } from '@data/interfaces/conteo-moneda';
import { CodigoDivisa } from '@data/types/divisa.types';
import { formatearNumero } from '@utils/dinero/formato-dinero';
import { esDiaHabil, hoyIso, sumarDias } from '@utils/fechas/fechas';

const HOY = hoyIso();
const DIAS_HISTORIAL = 21;
const HORA_ARQUEO = '12:30:00';
/** A caja never starts a day under this many typical differences of a currency. */
const MINIMO_APERTURA = 20;

type Saldos = Record<CodigoDivisa, number>;

/** The size of a typical counting difference per currency. */
const UNIDAD_DIFERENCIA: Record<CodigoDivisa, number> = {
  MXN: 50,
  USD: 20,
  EUR: 10,
  JPY: 1000,
  CNY: 40,
  KRW: 10000,
};

/** Hour of the corte per sucursal: Guadalajara closes at 17:00 and the rest at 18:00. */
const HORA_CORTE: Record<string, string> = {
  'suc-mty': '18:05:00',
  'suc-gdl': '17:05:00',
};

/** The usuarios (supervisión) who run the arqueos. */
const SUPERVISORES: readonly string[] = ['usr-0001', 'usr-0002'];

/** Every drawer that works shifts, including the one of the sucursal dada de baja. */
const CAJAS_CON_TURNO = CAJAS.filter((c) => c.tipo === 'CAJA');

const EFECTIVO_COMPLETADO = OPERACIONES.filter(
  (o) => o.estatus === 'COMPLETADA' && o.instrumento === 'EFECTIVO',
);

const redondear = (valor: number): number => Math.round(valor * 100) / 100;

const ceros = (): Saldos => Object.fromEntries(DIVISAS_CAJA.map((d) => [d, 0])) as Saldos;

/** What the cash operations of a caja did to its balance on a day (up to a time, if given). */
function netoDelDia(cajaId: string, dia: string, hasta?: string): Saldos {
  const neto = ceros();
  for (const o of EFECTIVO_COMPLETADO) {
    if (o.cajaId !== cajaId || !o.fechaOperacion.startsWith(dia)) continue;
    if (hasta && o.fechaOperacion > `${dia}T${hasta}`) continue;
    const signo = o.tipo === 'COMPRA' ? 1 : -1;
    neto[o.divisa] += signo * o.montoDivisa;
    neto['MXN'] -= signo * o.montoMxn;
  }
  return neto;
}

const tieneOperaciones = (cajaId: string, dia: string): boolean =>
  EFECTIVO_COMPLETADO.some((o) => o.cajaId === cajaId && o.fechaOperacion.startsWith(dia));

/** A counting difference in one currency: negative is a faltante. */
function diferencia(indice: number, signo: 1 | -1): Saldos {
  const dif = ceros();
  const divisa = DIVISAS_CAJA[indice % DIVISAS_CAJA.length];
  dif[divisa] = signo * UNIDAD_DIFERENCIA[divisa];
  return dif;
}

/** One conteo detail: `sistema` is what the system said and `contado` what was counted. */
function detalleDe(sistema: Saldos, dif: Saldos): ConteoMoneda[] {
  return DIVISAS_CAJA.map((divisa) => ({
    divisa,
    sistema: redondear(sistema[divisa]),
    contado: redondear(sistema[divisa] + dif[divisa]),
    diferencia: dif[divisa],
  }));
}

const sumar = (a: Saldos, b: Saldos, signo: 1 | -1 = 1): Saldos =>
  Object.fromEntries(DIVISAS_CAJA.map((d) => [d, redondear(a[d] + signo * b[d])])) as Saldos;

function diasDeSesion(caja: Caja): string[] {
  const dias: string[] = [];
  for (let atras = 0; atras <= DIAS_HISTORIAL; atras++) {
    const dia = sumarDias(HOY, -atras);
    const trabaja = caja.activa || dia <= FECHA_BAJA_TIJUANA;
    const sesion =
      atras === 0
        ? caja.abiertaEn !== null
        : (esDiaHabil(dia) && trabaja) || tieneOperaciones(caja.id, dia);
    if (sesion) dias.push(dia);
  }
  return dias;
}

/**
 * Walks each caja backward from what it holds today, so the system balances chain: a corte's
 * `sistema` is the apertura's count plus the day's cash operations, and the next apertura starts
 * from what the last corte counted, once its difference is settled.
 */
function construirConteos(): ConteoCaja[] {
  const conteos: ConteoCaja[] = [];
  CAJAS_CON_TURNO.forEach((caja, indiceCaja) => {
    const existencia = Object.fromEntries(
      DIVISAS_CAJA.map((d) => [
        d,
        EXISTENCIAS_CAJA.find((e) => e.cajaId === caja.id && e.divisa === d)?.saldo ?? 0,
      ]),
    ) as Saldos;
    const responsableBase =
      caja.responsableId ?? CAJEROS.find((c) => c.sucursalId === caja.sucursalId)?.id ?? '';
    let arrastre = existencia;

    diasDeSesion(caja).forEach((dia, orden) => {
      const hoy = dia === HOY;
      const atras = orden;
      const sesionId = `ses-${caja.id}-${dia}`;
      const responsable = responsableBase;
      const neto = netoDelDia(caja.id, dia);

      // Rare differences, spread so every filter has something to show.
      const difApertura = (indiceCaja * 5 + atras) % 11 === 4;
      const difCorte = !hoy && (indiceCaja * 7 + atras * 3) % 6 === 0;
      const signo: 1 | -1 = (atras + indiceCaja) % 2 === 0 ? -1 : 1;
      const cero = ceros();
      const difA = difApertura ? diferencia(indiceCaja + atras, signo) : cero;
      const difC = difCorte ? diferencia(indiceCaja + atras, signo) : cero;

      // Apertura counted, from the balance that must remain at the end of the session.
      let contadoApertura: Saldos;
      if (hoy) {
        contadoApertura = sumar(arrastre, neto, -1);
      } else {
        const sistemaCorte = sumar(arrastre, difC, -1);
        // A caja that bought more than it started with sends the surplus to its bóveda at the end
        // of the day, so the walk back never leaves a negative balance.
        const traspaso = ceros();
        contadoApertura = sumar(sistemaCorte, neto, -1);
        for (const divisa of DIVISAS_CAJA) {
          const minimo = MINIMO_APERTURA * UNIDAD_DIFERENCIA[divisa];
          if (contadoApertura[divisa] < minimo) {
            traspaso[divisa] = redondear(contadoApertura[divisa] - minimo);
            contadoApertura[divisa] = minimo;
          }
        }
        const enviado = DIVISAS_CAJA.filter((d) => traspaso[d] !== 0).map(
          (d) => `${d} ${formatearNumero(-traspaso[d], d === 'JPY' || d === 'KRW' ? 0 : 2)}`,
        );
        const observacionTraspaso = enviado.length
          ? `Incluye traspaso a bóveda: ${enviado.join(', ')}.`
          : null;
        conteos.push({
          id: `conteo-${sesionId}-corte`,
          cajaId: caja.id,
          sesionId,
          tipo: 'CORTE',
          responsableId: responsable,
          realizadoPorId: responsable,
          realizadoEn: `${dia}T${HORA_CORTE[caja.sucursalId] ?? '18:00:00'}`,
          observaciones:
            [
              difCorte
                ? signo < 0
                  ? 'Faltante a cargo del responsable.'
                  : 'Sobrante registrado a favor de la caja.'
                : null,
              observacionTraspaso,
            ]
              .filter((texto) => texto !== null)
              .join(' ') || null,
          detalle: detalleDe(sistemaCorte, difC),
        });
      }
      const sistemaApertura = sumar(contadoApertura, difA, -1);

      conteos.push({
        id: `conteo-${sesionId}-apertura`,
        cajaId: caja.id,
        sesionId,
        tipo: 'APERTURA',
        responsableId: responsable,
        realizadoPorId: responsable,
        realizadoEn: hoy && caja.abiertaEn ? caja.abiertaEn : `${dia}T08:${30 + indiceCaja * 5}:00`,
        observaciones: difApertura ? 'Diferencia contra el corte anterior, ya aclarada.' : null,
        detalle: detalleDe(sistemaApertura, difA),
      });

      if (!hoy && atras % 4 === 1) {
        const sistemaArqueo = sumar(contadoApertura, netoDelDia(caja.id, dia, HORA_ARQUEO));
        conteos.push({
          id: `conteo-${sesionId}-arqueo`,
          cajaId: caja.id,
          sesionId,
          tipo: 'ARQUEO',
          responsableId: responsable,
          realizadoPorId: SUPERVISORES[(indiceCaja + atras) % SUPERVISORES.length],
          realizadoEn: `${dia}T${HORA_ARQUEO}`,
          observaciones: 'Revisión durante el turno.',
          detalle: detalleDe(sistemaArqueo, atras % 8 === 1 ? diferencia(atras, signo) : cero),
        });
      }

      arrastre = sistemaApertura;
    });
  });
  return conteos;
}

/**
 * Aperturas, arqueos and cortes of the last weeks, deterministic relative to today and chained to
 * the cash operations and to what each caja holds now. Today's open cajas have only their apertura.
 */
export const CONTEOS_CAJA: readonly ConteoCaja[] = construirConteos();

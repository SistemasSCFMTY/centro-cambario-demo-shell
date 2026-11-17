import { UNIDADES_POR_USD } from '@data/constants/divisas.constants';
import { TipoCambioFix } from '@data/interfaces/tipo-cambio-fix';
import { TipoCambioVentanilla } from '@data/interfaces/tipo-cambio-ventanilla';
import { CodigoDivisa } from '@data/types/divisa.types';
import { TipoOperacion } from '@data/types/operacion.types';
import { redondear } from '@utils/dinero/formato-dinero';
import { diaHabilAnterior, esDiaHabil, hoyIso, sumarDias } from '@utils/fechas/fechas';

/** Days of FIX history in the fixture. */
const DIAS_HISTORIAL_FIX = 60;

/** Counter spread around the reference rate, per currency. */
const MARGEN_VENTANILLA: Record<CodigoDivisa, number> = {
  MXN: 0,
  USD: 0.015,
  EUR: 0.02,
  JPY: 0.025,
  CNY: 0.025,
  KRW: 0.03,
};

/** Small per-sucursal shift of the counter rates. */
const AJUSTE_SUCURSAL: Record<string, number> = {
  'suc-mty': 1,
  'suc-gdl': 1.002,
  'suc-tij': 1.004,
};

const DIVISAS_VENTANILLA: readonly CodigoDivisa[] = ['USD', 'EUR', 'JPY', 'CNY', 'KRW'];

/** Days since 1970-01-01 of an ISO date: a stable seed for the same date on any day. */
function ordinal(iso: string): number {
  const [anio, mes, dia] = iso.split('-').map(Number);
  return Math.round(Date.UTC(anio, mes - 1, dia) / 86_400_000);
}

/** The FIX of one day: a smooth, deterministic wobble around 17.3 pesos. */
export function fixDelDia(fecha: string): number {
  const n = ordinal(fecha);
  return redondear(17.3 + 0.3 * Math.sin(n / 5) + 0.06 * Math.cos(n * 1.7), 4);
}

/** The counter rate for `tipo` given the reference FIX: the centro buys low and sells high. */
export function cotizarVentanilla(
  divisa: CodigoDivisa,
  tipo: TipoOperacion,
  fix: number,
  sucursalId = 'suc-mty',
): number {
  const referencia = fix / UNIDADES_POR_USD[divisa];
  const margen = MARGEN_VENTANILLA[divisa];
  const factor = tipo === 'COMPRA' ? 1 - margen : 1 + margen;
  return redondear(referencia * factor * (AJUSTE_SUCURSAL[sucursalId] ?? 1), 4);
}

/** FIX published each business day over the last two months, newest first. */
export const FIX_DIARIO: readonly TipoCambioFix[] = Array.from(
  { length: DIAS_HISTORIAL_FIX },
  (_, i) => sumarDias(hoyIso(), -i),
)
  .filter(esDiaHabil)
  .map((fecha) => ({ fecha, tipoCambio: fixDelDia(fecha), fuente: 'Banxico (FIX)' }));

/** Today's counter rates per sucursal and currency, from the FIX of the previous business day. */
export const TIPOS_CAMBIO_VENTANILLA: readonly TipoCambioVentanilla[] = Object.keys(
  AJUSTE_SUCURSAL,
).flatMap((sucursalId) =>
  DIVISAS_VENTANILLA.map((divisa) => {
    const fix = fixDelDia(diaHabilAnterior(hoyIso()));
    return {
      sucursalId,
      divisa,
      compra: cotizarVentanilla(divisa, 'COMPRA', fix, sucursalId),
      venta: cotizarVentanilla(divisa, 'VENTA', fix, sucursalId),
      vigenteDesde: `${hoyIso()}T08:30:00`,
    };
  }),
);

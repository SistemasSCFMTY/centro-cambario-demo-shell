import { Operacion } from '@data/interfaces/operacion';
import { SemillaOperacion } from '@data/types/semilla-operacion.types';
import { CAJEROS } from '@data/fixtures/cajeros.fixture';
import { CLIENTES } from '@data/fixtures/clientes.fixture';
import { cotizarVentanilla, fixDelDia } from '@data/fixtures/tipos-cambio.fixture';
import { calcularOperacion } from '@utils/operaciones/calculo-operacion';
import { diaHabilAnterior, hoyIso, sumarDias } from '@utils/fechas/fechas';

/** The superadmins who authorize in the fixture. */
const AUTORIZADORES = ['usr-0001', 'usr-0002'];

const CAJA_DE_CAJERO: Record<string, string> = {
  'cajero-01': 'caja-mty-1',
  'cajero-02': 'caja-mty-2',
  'cajero-03': 'caja-gdl-1',
  'cajero-04': 'caja-gdl-2',
  'cajero-05': 'caja-tij-1',
};

/**
 * What happened, in order: each line is run through the demo's rules to fill pesos, USD, level,
 * relevante and authorization. Registered clientes stay within their expediente level and the
 * 10,000 USD daily limit; occasional ones stay under 1,000 USD.
 */
const SEMILLAS: readonly SemillaOperacion[] = [
  [0, '09:12', 'cajero-01', null, 'COMPRA', 'EFECTIVO', 'USD', 300],
  [0, '09:40', 'cajero-02', 'cli-01', 'VENTA', 'EFECTIVO', 'EUR', 1500],
  [0, '10:05', 'cajero-03', 'cli-12', 'COMPRA', 'EFECTIVO', 'USD', 7500],
  [0, '10:30', 'cajero-01', 'cli-02', 'VENTA', 'EFECTIVO', 'USD', 2500],
  [0, '11:02', 'cajero-04', null, 'VENTA', 'EFECTIVO', 'JPY', 60000],
  [0, '11:25', 'cajero-02', 'cli-13', 'COMPRA', 'TRANSFERENCIA', 'USD', 9000],
  [0, '11:48', 'cajero-03', 'cli-06', 'COMPRA', 'EFECTIVO', 'USD', 1200],
  [0, '12:10', 'cajero-01', 'cli-03', 'VENTA', 'EFECTIVO', 'USD', 900],
  [1, '09:20', 'cajero-01', 'cli-04', 'COMPRA', 'EFECTIVO', 'USD', 5200],
  [1, '10:15', 'cajero-02', 'cli-11', 'VENTA', 'TRANSFERENCIA', 'USD', 4000],
  [1, '11:30', 'cajero-03', null, 'COMPRA', 'EFECTIVO', 'EUR', 400],
  [1, '12:45', 'cajero-04', 'cli-07', 'VENTA', 'EFECTIVO', 'USD', 1800],
  [1, '13:10', 'cajero-01', 'cli-05', 'COMPRA', 'EFECTIVO', 'USD', 600],
  [1, '15:20', 'cajero-02', null, 'VENTA', 'EFECTIVO', 'CNY', 2000],
  [1, '16:05', 'cajero-03', 'cli-13', 'VENTA', 'TRANSFERENCIA', 'USD', 3000],
  [1, '16:40', 'cajero-01', 'cli-09', 'COMPRA', 'EFECTIVO', 'USD', 2000, 'RECHAZADA'],
  [2, '09:05', 'cajero-02', 'cli-02', 'COMPRA', 'EFECTIVO', 'USD', 4800],
  [2, '10:50', 'cajero-03', 'cli-12', 'VENTA', 'EFECTIVO', 'EUR', 3200],
  [2, '12:20', 'cajero-01', null, 'COMPRA', 'EFECTIVO', 'USD', 450],
  [2, '14:35', 'cajero-04', 'cli-10', 'VENTA', 'EFECTIVO', 'USD', 1500],
  [2, '17:00', 'cajero-02', 'cli-01', 'VENTA', 'CHEQUE_VIAJERO', 'USD', 6000],
  [3, '09:30', 'cajero-01', 'cli-06', 'VENTA', 'EFECTIVO', 'EUR', 2000],
  [3, '11:10', 'cajero-03', null, 'VENTA', 'EFECTIVO', 'KRW', 500000],
  [3, '13:25', 'cajero-02', 'cli-11', 'COMPRA', 'EFECTIVO', 'USD', 8200],
  [3, '15:45', 'cajero-04', 'cli-03', 'COMPRA', 'EFECTIVO', 'USD', 2200, 'CANCELADA'],
  [4, '10:00', 'cajero-01', 'cli-05', 'VENTA', 'EFECTIVO', 'EUR', 1800],
  [4, '12:30', 'cajero-02', null, 'COMPRA', 'EFECTIVO', 'USD', 800],
  [4, '16:10', 'cajero-03', 'cli-13', 'COMPRA', 'EFECTIVO', 'USD', 3500],
  [5, '09:45', 'cajero-04', 'cli-07', 'COMPRA', 'EFECTIVO', 'EUR', 2500],
  [5, '11:55', 'cajero-01', 'cli-02', 'VENTA', 'TRANSFERENCIA', 'USD', 7000],
  [5, '14:15', 'cajero-02', 'cli-04', 'VENTA', 'EFECTIVO', 'USD', 3100],
  [6, '10:20', 'cajero-03', null, 'VENTA', 'EFECTIVO', 'USD', 950],
  [6, '13:05', 'cajero-01', 'cli-12', 'COMPRA', 'EFECTIVO', 'USD', 5600],
  [7, '09:15', 'cajero-02', 'cli-01', 'COMPRA', 'EFECTIVO', 'USD', 3900],
  [7, '12:40', 'cajero-04', 'cli-06', 'VENTA', 'EFECTIVO', 'JPY', 400000],
  [7, '15:30', 'cajero-01', null, 'COMPRA', 'EFECTIVO', 'EUR', 300],
  [8, '10:35', 'cajero-03', 'cli-11', 'VENTA', 'EFECTIVO', 'USD', 5500],
  [8, '16:20', 'cajero-02', 'cli-10', 'COMPRA', 'EFECTIVO', 'USD', 700],
  [9, '09:50', 'cajero-01', 'cli-03', 'VENTA', 'EFECTIVO', 'EUR', 2400],
  [9, '11:20', 'cajero-04', 'cli-13', 'VENTA', 'EFECTIVO', 'USD', 4200],
  [9, '14:00', 'cajero-02', null, 'VENTA', 'EFECTIVO', 'USD', 600],
  [10, '10:10', 'cajero-03', 'cli-08', 'VENTA', 'EFECTIVO', 'USD', 1900],
  [10, '12:55', 'cajero-01', 'cli-02', 'COMPRA', 'EFECTIVO', 'EUR', 4000],
  [11, '09:35', 'cajero-02', 'cli-12', 'VENTA', 'TRANSFERENCIA', 'USD', 6500],
  [11, '13:40', 'cajero-04', 'cli-07', 'VENTA', 'EFECTIVO', 'CNY', 12000],
  [12, '11:00', 'cajero-01', 'cli-01', 'VENTA', 'EFECTIVO', 'USD', 2800],
  [12, '15:10', 'cajero-03', null, 'COMPRA', 'EFECTIVO', 'JPY', 90000],
  [13, '10:25', 'cajero-02', 'cli-06', 'COMPRA', 'EFECTIVO', 'USD', 5100],
  [13, '12:15', 'cajero-01', 'cli-14', 'VENTA', 'EFECTIVO', 'USD', 2600],
  [14, '09:55', 'cajero-04', 'cli-11', 'COMPRA', 'EFECTIVO', 'USD', 3300],
  [14, '14:45', 'cajero-03', 'cli-05', 'VENTA', 'EFECTIVO', 'EUR', 1200],
  [15, '10:40', 'cajero-01', 'cli-04', 'VENTA', 'EFECTIVO', 'USD', 6200, 'RECHAZADA'],
  [15, '16:00', 'cajero-02', null, 'VENTA', 'EFECTIVO', 'KRW', 800000],
  [16, '11:15', 'cajero-03', 'cli-13', 'COMPRA', 'TRANSFERENCIA', 'EUR', 5000],
  [17, '09:25', 'cajero-01', 'cli-03', 'COMPRA', 'EFECTIVO', 'USD', 1600],
  [17, '13:50', 'cajero-04', 'cli-12', 'VENTA', 'EFECTIVO', 'USD', 4400],
  [18, '10:45', 'cajero-02', 'cli-02', 'VENTA', 'EFECTIVO', 'USD', 3700, 'CANCELADA'],
  [19, '12:05', 'cajero-01', 'cli-10', 'VENTA', 'EFECTIVO', 'USD', 1100],
  [20, '09:40', 'cajero-05', 'cli-13', 'COMPRA', 'EFECTIVO', 'USD', 4600],
  [21, '11:25', 'cajero-05', null, 'VENTA', 'EFECTIVO', 'USD', 750],
  [22, '14:30', 'cajero-03', 'cli-11', 'COMPRA', 'EFECTIVO', 'USD', 5800],
  [23, '10:00', 'cajero-02', 'cli-01', 'COMPRA', 'EFECTIVO', 'EUR', 2200],
  [24, '13:15', 'cajero-05', 'cli-14', 'COMPRA', 'TRANSFERENCIA', 'USD', 3400],
  [25, '09:30', 'cajero-01', 'cli-06', 'VENTA', 'EFECTIVO', 'USD', 4900],
  [26, '15:50', 'cajero-04', 'cli-07', 'VENTA', 'EFECTIVO', 'USD', 2000],
  [27, '11:40', 'cajero-02', null, 'COMPRA', 'EFECTIVO', 'USD', 500],
  [28, '10:05', 'cajero-05', 'cli-13', 'VENTA', 'EFECTIVO', 'USD', 3900],
];

function horaActual(): string {
  const ahora = new Date();
  return `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
}

function construirOperaciones(): Operacion[] {
  const hoy = hoyIso();
  const cronologicas = SEMILLAS.map((semilla, orden) => ({ semilla, orden }))
    .map(({ semilla, orden }) => ({ semilla, orden, fecha: sumarDias(hoy, -semilla[0]) }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.semilla[1].localeCompare(b.semilla[1]));

  const contadorPorDia = new Map<string, number>();
  return cronologicas.map(({ semilla, fecha }, indice) => {
    const [dias, horaSemilla, cajeroId, clienteId, tipo, instrumento, divisa, monto, forzar] =
      semilla;
    // Today's seeds never run ahead of the clock.
    const hora = dias === 0 && horaSemilla > horaActual() ? horaActual() : horaSemilla;
    const cliente = clienteId ? CLIENTES.find((c) => c.id === clienteId)! : null;
    const sucursalId = CAJEROS.find((c) => c.id === cajeroId)!.sucursalId;
    const fixFecha = diaHabilAnterior(fecha);
    const fixTipoCambio = fixDelDia(fixFecha);
    const tipoCambio = cotizarVentanilla(divisa, tipo, fixTipoCambio, sucursalId);
    const calculo = calcularOperacion({
      tipo,
      instrumento,
      divisa,
      montoDivisa: monto,
      tipoCambio,
      fixTipoCambio,
      cliente: cliente
        ? {
            tipoPersona: cliente.tipoPersona,
            gradoRiesgo: cliente.gradoRiesgo,
            tipoPep: cliente.tipoPep,
          }
        : null,
    });

    const motivos = [...calculo.motivosAutorizacion];
    if (forzar === 'RECHAZADA' && cliente?.estatus === 'BLOQUEADO') {
      motivos.push('Coincidencia en lista de personas bloqueadas');
    }
    const requiereAutorizacion = motivos.length > 0;
    const autorizada = requiereAutorizacion && dias >= 2 && forzar !== 'RECHAZADA';
    const rechazadaPorLista = forzar === 'RECHAZADA' && cliente?.estatus === 'BLOQUEADO';
    const rechazadaPorAutorizador = forzar === 'RECHAZADA' && !rechazadaPorLista;
    const resuelta = autorizada || rechazadaPorAutorizador;

    const folioNumero = (contadorPorDia.get(fecha) ?? 0) + 1;
    contadorPorDia.set(fecha, folioNumero);
    const horaResolucion = String(Number(hora.slice(0, 2)) + 1).padStart(2, '0') + hora.slice(2);

    return {
      id: `op-${String(indice + 1).padStart(4, '0')}`,
      folio: `OP-${fecha.replace(/-/g, '')}-${String(folioNumero).padStart(4, '0')}`,
      fechaOperacion: `${fecha}T${hora}:00`,
      tipo,
      instrumento,
      divisa,
      montoDivisa: monto,
      tipoCambio,
      montoMxn: calculo.montoMxn,
      fixFecha,
      fixTipoCambio,
      montoUsd: calculo.montoUsd,
      nivelRequerido: calculo.nivelRequerido,
      esRelevante: calculo.esRelevante,
      reportableCompraUsd: calculo.reportableCompraUsd,
      requiereAutorizacion,
      motivoAutorizacion: requiereAutorizacion ? motivos.join('; ') : null,
      estatus:
        forzar === 'CANCELADA'
          ? 'CANCELADA'
          : forzar === 'RECHAZADA'
            ? 'RECHAZADA'
            : requiereAutorizacion && !autorizada
              ? 'PENDIENTE_AUTORIZACION'
              : 'COMPLETADA',
      autorizadoPorId: resuelta ? AUTORIZADORES[indice % AUTORIZADORES.length] : null,
      autorizadoEn: resuelta ? `${fecha}T${horaResolucion}:00` : null,
      comentarioAutorizacion: autorizada
        ? 'Se revisó el expediente y la procedencia de los recursos.'
        : rechazadaPorAutorizador
          ? 'No se acreditó el origen de los recursos.'
          : null,
      sucursalId,
      cajaId: CAJA_DE_CAJERO[cajeroId],
      cajeroId,
      clienteId,
      nombreOcasional: null,
      origenRecursos: cliente?.origenRecursos ?? null,
      destinoRecursos: cliente ? (tipo === 'COMPRA' ? 'GASTOS_MX' : cliente.destinoRecursos) : null,
    };
  });
}

/** About four weeks of operations, oldest first, consistent with the demo's rules. */
export const OPERACIONES: readonly Operacion[] = construirOperaciones();

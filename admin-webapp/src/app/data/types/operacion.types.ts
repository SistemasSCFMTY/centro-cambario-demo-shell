/** The centro cambiario's side: COMPRA = it buys divisas, VENTA = it sells them. */
export type TipoOperacion = 'COMPRA' | 'VENTA';

export type EstatusOperacion = 'COMPLETADA' | 'PENDIENTE_AUTORIZACION' | 'RECHAZADA' | 'CANCELADA';

/** Instruments of column 9 of the official format that the demo keeps active. */
export type InstrumentoMonetario = 'EFECTIVO' | 'TRANSFERENCIA' | 'CHEQUE_VIAJERO';

/** Required ID level: 0 none, 1 datos básicos, 2 + copia de identificación, 3 expediente completo. */
export type NivelExpediente = 0 | 1 | 2 | 3;

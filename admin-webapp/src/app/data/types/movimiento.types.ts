/** Kinds of cash logistics (plans/02 Module map): drawer or branch transfers, secured transport, replenishments. */
export type ClaseMovimiento = 'TRASPASO' | 'TRASLADO_VALORES' | 'DOTACION';

/**
 * Where a movement stands. Traspasos and traslados go EN_TRANSITO → RECIBIDO | CANCELADO;
 * a dotación goes PENDIENTE_APROBACION → APROBADA | RECHAZADA.
 */
export type EstatusMovimiento =
  'EN_TRANSITO' | 'RECIBIDO' | 'CANCELADO' | 'PENDIENTE_APROBACION' | 'APROBADA' | 'RECHAZADA';

/** What one end of a movement is: a drawer or vault, a whole sucursal, or a bank. */
export type TipoExtremoMovimiento = 'CAJA' | 'SUCURSAL' | 'BANCO';

/** How a step of a movement's trail stands. */
export type EstadoPasoMovimiento = 'hecho' | 'pendiente' | 'negativo';

/** The quick views of the list, kept in the URL as `vista`. */
export type VistaMovimientos = 'traspasos' | 'traslados' | 'dotaciones' | 'por-aprobar';

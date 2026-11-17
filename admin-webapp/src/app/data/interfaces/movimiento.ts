import { DatosTraslado } from '@data/interfaces/datos-traslado';
import { MontoMovimiento } from '@data/interfaces/monto-movimiento';
import {
  ClaseMovimiento,
  EstatusMovimiento,
  TipoExtremoMovimiento,
} from '@data/types/movimiento.types';

/** Cash logistics that doesn't belong to one shift: a traspaso, a traslado de valores or a dotación. */
export interface Movimiento {
  id: string;
  /** TRP-, TRV- or DOT- plus a sequence. */
  folio: string;
  clase: ClaseMovimiento;
  estatus: EstatusMovimiento;
  origenTipo: TipoExtremoMovimiento;
  /** A caja, sucursal or banco id, by `origenTipo`. */
  origenId: string;
  destinoTipo: TipoExtremoMovimiento;
  destinoId: string;
  /** What moves now: the authorized amounts once a dotación is reviewed. */
  montos: MontoMovimiento[];
  /** What was asked for. Differs from `montos` only when the review corrected a dotación. */
  montosSolicitados: MontoMovimiento[];
  /** The cajero who sent the cash or asked for the dotación. */
  solicitadoPorId: string;
  /** Local ISO date-time of the send or the request. */
  fecha: string;
  observaciones: string | null;
  /** Why it was declined or cancelled; for an approval, the reviewer's comment on the correction. */
  notaResolucion: string | null;
  /** Who received, cancelled, approved or declined it: a cajero or a superadmin id. */
  resueltoPorId: string | null;
  /** Local ISO date-time of that resolution. */
  resueltoEn: string | null;
  /** Only a traslado de valores. */
  traslado: DatosTraslado | null;
}

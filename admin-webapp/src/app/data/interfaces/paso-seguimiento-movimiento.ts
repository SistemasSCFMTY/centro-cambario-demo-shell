import { CambioAuditoria } from '@data/interfaces/cambio-auditoria';
import { EstadoPasoMovimiento } from '@data/types/movimiento.types';

/** One step of a movement's status trail. */
export interface PasoSeguimientoMovimiento {
  etiqueta: string;
  estado: EstadoPasoMovimiento;
  /** Local ISO date-time; null for a step that hasn't happened. */
  fecha: string | null;
  usuario: string | null;
  nota: string | null;
  /** The amounts a correction changed, per currency; only on «Corregida y aprobada». */
  cambios?: CambioAuditoria[];
}

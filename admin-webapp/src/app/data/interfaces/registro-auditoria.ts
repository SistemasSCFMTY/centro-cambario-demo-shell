import { CambioAuditoria } from '@data/interfaces/cambio-auditoria';
import { EntidadAuditada } from '@data/types/auditoria.types';

/** One line of a record's audit trail: who did what and when (plans/01 Auditoría). */
export interface RegistroAuditoria {
  id: string;
  entidad: EntidadAuditada;
  entidadId: string;
  /** Local ISO date-time. */
  fecha: string;
  usuario: string;
  accion: string;
  detalle: string | null;
  cambios: CambioAuditoria[];
}

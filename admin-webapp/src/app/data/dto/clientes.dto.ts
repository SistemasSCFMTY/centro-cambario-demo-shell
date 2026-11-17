import { ClienteDetalle } from '@data/interfaces/cliente-detalle';
import { RegistroAuditoria } from '@data/interfaces/registro-auditoria';

export interface ClienteDetalleDto {
  cliente: ClienteDetalle;
  auditoria: RegistroAuditoria[];
}

import { Operacion } from '@data/interfaces/operacion';
import { RegistroAuditoria } from '@data/interfaces/registro-auditoria';

/** An operation with the names a list row shows. */
export interface OperacionListaDto extends Operacion {
  sucursal: string;
  caja: string;
  cajero: string;
  /** Name of the registered cliente; null for an occasional one. */
  cliente: string | null;
  numeroCliente: string | null;
  /** Name of the administrador who resolved the authorization; null while none did. */
  autorizadoPor: string | null;
}

export interface OperacionDetalleDto {
  operacion: OperacionListaDto;
  auditoria: RegistroAuditoria[];
}

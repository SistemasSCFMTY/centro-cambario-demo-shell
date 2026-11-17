/** A usuario (staff) who works at the counter. */
export interface Cajero {
  id: string;
  nombreCompleto: string;
  correo: string;
  sucursalId: string;
  activo: boolean;
}

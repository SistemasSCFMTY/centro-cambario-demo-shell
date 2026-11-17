import { TipoCaja } from '@data/types/caja.types';

/** A drawer or the vault of a sucursal, with the session that is open on it, if any. */
export interface Caja {
  id: string;
  sucursalId: string;
  clave: string;
  nombre: string;
  tipo: TipoCaja;
  activa: boolean;
  /** The cajero responsible for the open session; null while closed. */
  responsableId: string | null;
  /** Local ISO date-time the open session started; null while closed. */
  abiertaEn: string | null;
}

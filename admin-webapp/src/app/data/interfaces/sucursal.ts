import { EstatusSucursal } from '@data/types/sucursal.types';

export interface Sucursal {
  id: string;
  /** 2–15 of A–Z 0–9 _ -, unique. */
  clave: string;
  nombre: string;
  estatus: EstatusSucursal;
  /** The usuario (staff) in charge of the sucursal. */
  responsableId: string | null;
  calle: string;
  numeroExterior: string;
  numeroInterior: string | null;
  colonia: string;
  /** Column 7 of the official reports: 5 digits. */
  codigoPostal: string;
  /** Name of the municipio or alcaldía (CNBV catalog, title case). */
  municipio: string;
  entidad: string;
  /** Column 6 of the official reports: CNBV localidad key, 8 digits. */
  localidad: string;
  /** What the catalog says for `localidad`; filled by the backend. */
  localidadDescripcion: string;
  telefono: string;
  horario: string;
}

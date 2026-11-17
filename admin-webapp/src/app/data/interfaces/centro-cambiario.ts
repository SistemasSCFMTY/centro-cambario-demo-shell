import { CodigoDivisa } from '@data/types/divisa.types';

/** The tenant's own profile (plans/04 General tab). The legal data is the negocio writer's. */
export interface CentroCambiario {
  nombreComercial: string;
  razonSocial: string;
  rfc: string;
  /** ISO date. */
  inicioOperaciones: string;
  sucursalMatrizId: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string | null;
  colonia: string;
  municipio: string;
  entidad: string;
  codigoPostal: string;
  localidad: string;
  /** What the catalog says for `localidad`; filled by the backend. */
  localidadDescripcion: string;
  telefono: string;
  correo: string;
  sitioWeb: string | null;
  horario: string | null;
  /** Divisas the centro operates besides MXN. */
  divisas: CodigoDivisa[];
  /** Maximum a cliente may operate per day, in USD (LIMITE_DIARIO_USD). */
  limiteDiarioUsd: number;
}

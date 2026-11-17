import { Divisa } from '@data/interfaces/divisa';
import { OpcionCatalogo } from '@data/interfaces/opcion-catalogo';

/** The small lists the negocio forms choose from. */
export interface OpcionesNegocio {
  /** Divisas the centro may operate besides MXN. */
  divisas: Divisa[];
  /** Entidades federativas (CNBV); the label is what gets stored. */
  entidades: OpcionCatalogo[];
  /** Sucursales activas, for the matriz. */
  sucursales: OpcionCatalogo[];
  /** Usuarios that can be the Oficial de Cumplimiento. */
  usuarios: OpcionCatalogo[];
  /** Usuarios (staff) that can be a sucursal's responsable. */
  responsables: OpcionCatalogo[];
}

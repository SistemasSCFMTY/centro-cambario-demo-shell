import { CampoDetalle } from '@data/interfaces/campo-detalle';

/** A titled group of read-only fields on the General and Legal tabs. */
export interface SeccionDetalleNegocio {
  id: string;
  titulo: string;
  campos: CampoDetalle[];
}

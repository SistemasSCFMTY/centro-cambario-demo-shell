import { CampoDetalle } from '@data/interfaces/campo-detalle';

/** One section of the operación detail: a title, what it is for and its field grid. */
export interface SeccionOperacion {
  id: string;
  titulo: string;
  descripcion: string;
  campos: readonly CampoDetalle[];
}

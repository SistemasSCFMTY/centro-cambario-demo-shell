import { ElementoNavegacion } from '@data/interfaces/elemento-navegacion';

export interface GrupoNavegacion {
  /** null for the ungrouped first item (Inicio). */
  etiqueta: string | null;
  elementos: readonly ElementoNavegacion[];
}

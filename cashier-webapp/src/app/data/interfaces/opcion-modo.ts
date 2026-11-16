import { ModoTema } from '@data/types/tema.types';

/** One choice in the Sistema · Claro · Oscuro theme menu. */
export interface OpcionModo {
  valor: ModoTema;
  etiqueta: string;
  /** Lucide icon name, registered by the theme menu. */
  icono: string;
}

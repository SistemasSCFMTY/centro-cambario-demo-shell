import { ModoTema } from '@data/types/tema.types';

/** One segment of the Sistema · Claro · Oscuro switch. */
export interface OpcionModo {
  valor: ModoTema;
  etiqueta: string;
  /** Lucide icon name, registered by the switch. */
  icono: string;
}

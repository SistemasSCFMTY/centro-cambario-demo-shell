import { OrdenLista } from '@data/interfaces/orden-lista';

/** The state of a list page, read from its URL. `filtros` holds only the non-empty ones. */
export interface EstadoLista {
  /** 1-based. */
  pagina: number;
  tamano: number;
  orden: OrdenLista | null;
  filtros: Record<string, string>;
}

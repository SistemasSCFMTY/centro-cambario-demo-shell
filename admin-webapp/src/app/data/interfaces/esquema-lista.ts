import { DefinicionFiltro } from '@data/interfaces/definicion-filtro';
import { OrdenLista } from '@data/interfaces/orden-lista';

/** What a list page accepts in its URL. Anything else is dropped on read. */
export interface EsquemaLista {
  tamanos: readonly number[];
  tamanoInicial: number;
  /** Column ids the API can sort by. */
  ordenables: readonly string[];
  ordenInicial: OrdenLista | null;
  filtros: readonly DefinicionFiltro[];
}

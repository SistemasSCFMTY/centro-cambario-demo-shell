import { OpcionFiltro } from '@data/interfaces/opcion-filtro';
import { TipoFiltro } from '@data/types/lista.types';

/** One filter of a list: read from the URL, sanitized, and drawn in the Filtros popover. */
export interface DefinicionFiltro {
  /** The query param name. Never `pagina`, `limite`, `orden` or `direccion`. */
  id: string;
  etiqueta: string;
  tipo: TipoFiltro;
  /** Whitelist for `seleccion`; any other value in the URL is dropped. */
  opciones?: OpcionFiltro[];
  /** Lives in the URL but not in the popover (a view switch such as `vista`). Not counted as active. */
  soloUrl?: boolean;
}

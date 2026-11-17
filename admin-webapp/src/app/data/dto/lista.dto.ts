import { DireccionOrden } from '@data/types/lista.types';

/** What a list endpoint receives as query params: `pagina`, `limite`, `orden`, `direccion` and one param per filter. */
export interface ConsultaListaDto {
  /** 1-based. */
  pagina: number;
  limite: number;
  orden: string | null;
  direccion: DireccionOrden | null;
  filtros: Record<string, string>;
}

/** What a list endpoint answers: one page and the total behind it. */
export interface PaginaDto<T> {
  filas: T[];
  total: number;
  pagina: number;
  limite: number;
}

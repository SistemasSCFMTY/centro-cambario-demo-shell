import { EstadoLista } from '@data/interfaces/estado-lista';

/** Query param names every list endpoint and every list URL share. */
export const PARAMETROS_LISTA = {
  pagina: 'pagina',
  limite: 'limite',
  orden: 'orden',
  direccion: 'direccion',
} as const;

export const TAMANOS_PAGINA: readonly number[] = [10, 25, 50];
export const TAMANO_PAGINA_INICIAL = 25;
/** Largest page a list request may ask for. */
export const LIMITE_PAGINA_MAXIMO = 200;

/** Longest text filter the URL accepts. */
export const LONGITUD_MAXIMA_FILTRO = 100;

/** Body rows of the loading skeleton. */
export const FILAS_ESQUELETO = 8;

/** Row heights in rem for a paged table's floor (plans/01 Paging). */
export const ALTO_FILA_REM = { compacta: 2.5, alta: 3.5 } as const;
export const ALTO_ENCABEZADO_TABLA_REM = 2.75;

/** Numbered page buttons around the current page. */
export const PAGINAS_VECINAS = 1;

/** A list page before its schema arrives. */
export const ESTADO_LISTA_INICIAL: EstadoLista = {
  pagina: 1,
  tamano: TAMANO_PAGINA_INICIAL,
  orden: null,
  filtros: {},
};

import {
  LIMITE_PAGINA_MAXIMO,
  PARAMETROS_LISTA,
  TAMANO_PAGINA_INICIAL,
} from '@data/constants/lista.constants';
import { ConsultaListaDto, PaginaDto } from '@data/dto/lista.dto';
import { EstadoLista } from '@data/interfaces/estado-lista';
import { DireccionOrden } from '@data/types/lista.types';

const RESERVADOS: readonly string[] = Object.values(PARAMETROS_LISTA);

/** The request a list state turns into (what a service sends). */
export function consultaDeEstado(estado: EstadoLista): ConsultaListaDto {
  return {
    pagina: estado.pagina,
    limite: estado.tamano,
    orden: estado.orden?.columna ?? null,
    direccion: estado.orden?.direccion ?? null,
    filtros: estado.filtros,
  };
}

/** The query params of a list request. Never carries an empty value. */
export function parametrosDeConsulta(consulta: ConsultaListaDto): Record<string, string> {
  const parametros: Record<string, string> = {
    [PARAMETROS_LISTA.pagina]: String(consulta.pagina),
    [PARAMETROS_LISTA.limite]: String(consulta.limite),
  };
  if (consulta.orden && consulta.direccion) {
    parametros[PARAMETROS_LISTA.orden] = consulta.orden;
    parametros[PARAMETROS_LISTA.direccion] = consulta.direccion;
  }
  for (const [id, valor] of Object.entries(consulta.filtros)) {
    if (valor !== '' && !RESERVADOS.includes(id)) parametros[id] = valor;
  }
  return parametros;
}

/** What a simulated handler does with the params it received: the request, with safe defaults. */
export function consultaDeParametros(parametros: Record<string, string>): ConsultaListaDto {
  const pagina = Number(parametros[PARAMETROS_LISTA.pagina]);
  const limite = Number(parametros[PARAMETROS_LISTA.limite]);
  const direccion = parametros[PARAMETROS_LISTA.direccion];
  const filtros: Record<string, string> = {};
  for (const [id, valor] of Object.entries(parametros)) {
    if (!RESERVADOS.includes(id) && valor !== '') filtros[id] = valor;
  }
  return {
    pagina: Number.isInteger(pagina) && pagina >= 1 ? pagina : 1,
    limite:
      Number.isInteger(limite) && limite >= 1
        ? Math.min(limite, LIMITE_PAGINA_MAXIMO)
        : TAMANO_PAGINA_INICIAL,
    orden: parametros[PARAMETROS_LISTA.orden] || null,
    direccion: direccion === 'asc' || direccion === 'desc' ? (direccion as DireccionOrden) : null,
    filtros,
  };
}

type ValorOrdenable = string | number | null;

function comparar(a: ValorOrdenable, b: ValorOrdenable): number {
  if (a === b) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), 'es');
}

/**
 * Sorts and slices `filas` like a paged server. `ordenadores` maps each sortable column id to the
 * value to sort by; an unknown column keeps the incoming order. Filter before calling this.
 */
export function paginar<T>(
  filas: readonly T[],
  consulta: ConsultaListaDto,
  ordenadores: Record<string, (fila: T) => ValorOrdenable>,
): PaginaDto<T> {
  const ordenador = consulta.orden ? ordenadores[consulta.orden] : undefined;
  const ordenadas = ordenador
    ? [...filas].sort((a, b) => {
        const resultado = comparar(ordenador(a), ordenador(b));
        return consulta.direccion === 'desc' && resultado !== 0 ? -resultado : resultado;
      })
    : [...filas];
  const inicio = (consulta.pagina - 1) * consulta.limite;
  return {
    filas: ordenadas.slice(inicio, inicio + consulta.limite),
    total: ordenadas.length,
    pagina: consulta.pagina,
    limite: consulta.limite,
  };
}

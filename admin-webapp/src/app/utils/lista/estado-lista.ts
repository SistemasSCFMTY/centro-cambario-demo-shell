import { LONGITUD_MAXIMA_FILTRO, PARAMETROS_LISTA } from '@data/constants/lista.constants';
import { DefinicionFiltro } from '@data/interfaces/definicion-filtro';
import { EsquemaLista } from '@data/interfaces/esquema-lista';
import { EstadoLista } from '@data/interfaces/estado-lista';
import { LectorParametros } from '@data/interfaces/lector-parametros';
import { OrdenLista } from '@data/interfaces/orden-lista';
import { DireccionOrden } from '@data/types/lista.types';

const FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;

function enteroPositivo(texto: string | null): number | null {
  if (texto === null || !/^\d+$/.test(texto)) return null;
  const valor = Number(texto);
  return valor >= 1 ? valor : null;
}

function fechaValida(texto: string): boolean {
  if (!FECHA_ISO.test(texto)) return false;
  const [anio, mes, dia] = texto.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
}

/** The sanitized value of one filter, or null when it's missing or garbage. */
function leerFiltro(definicion: DefinicionFiltro, crudo: string | null): string | null {
  const texto = crudo?.trim() ?? '';
  if (!texto) return null;
  switch (definicion.tipo) {
    case 'seleccion':
      return !definicion.opciones || definicion.opciones.some((o) => o.valor === texto)
        ? texto
        : null;
    case 'fecha':
      return fechaValida(texto) ? texto : null;
    case 'numero':
      return /^\d+(\.\d+)?$/.test(texto) ? texto : null;
    case 'texto':
      return texto.slice(0, LONGITUD_MAXIMA_FILTRO);
  }
}

function leerOrden(esquema: EsquemaLista, lector: LectorParametros): OrdenLista | null {
  const columna = lector.get(PARAMETROS_LISTA.orden);
  const direccion = lector.get(PARAMETROS_LISTA.direccion);
  if (
    columna &&
    esquema.ordenables.includes(columna) &&
    (direccion === 'asc' || direccion === 'desc')
  ) {
    return { columna, direccion: direccion as DireccionOrden };
  }
  return esquema.ordenInicial;
}

/**
 * The state of a list page from its query params. Sanitizes on read (plans/01): the page size and
 * sort must be in the schema, enum filters in their options, dates real, and the rest is trimmed
 * and clamped, so garbage never reaches state or the API. The page is clamped at the lower end only:
 * the upper end needs the total (`paginaMaxima`).
 */
export function leerEstadoLista(lector: LectorParametros, esquema: EsquemaLista): EstadoLista {
  const tamanoUrl = enteroPositivo(lector.get(PARAMETROS_LISTA.limite));
  const tamano =
    tamanoUrl !== null && esquema.tamanos.includes(tamanoUrl) ? tamanoUrl : esquema.tamanoInicial;
  const filtros: Record<string, string> = {};
  for (const definicion of esquema.filtros) {
    const valor = leerFiltro(definicion, lector.get(definicion.id));
    if (valor !== null) filtros[definicion.id] = valor;
  }
  return {
    pagina: enteroPositivo(lector.get(PARAMETROS_LISTA.pagina)) ?? 1,
    tamano,
    orden: leerOrden(esquema, lector),
    filtros,
  };
}

/**
 * The query params that represent a state. Empty filters, page 1, the default size and the default
 * sort are dropped, so the clean URL is the plain path. Merge with `null` for the dropped ones.
 */
export function parametrosDeEstado(
  estado: EstadoLista,
  esquema: EsquemaLista,
): Record<string, string> {
  const parametros: Record<string, string> = { ...estado.filtros };
  if (estado.pagina > 1) parametros[PARAMETROS_LISTA.pagina] = String(estado.pagina);
  if (estado.tamano !== esquema.tamanoInicial) {
    parametros[PARAMETROS_LISTA.limite] = String(estado.tamano);
  }
  const inicial = esquema.ordenInicial;
  const esInicial =
    estado.orden?.columna === inicial?.columna && estado.orden?.direccion === inicial?.direccion;
  if (estado.orden && !esInicial) {
    parametros[PARAMETROS_LISTA.orden] = estado.orden.columna;
    parametros[PARAMETROS_LISTA.direccion] = estado.orden.direccion;
  }
  return parametros;
}

/** Filters that count in the popover's badge: set, and not URL-only view switches. */
export function contarFiltrosActivos(estado: EstadoLista, esquema: EsquemaLista): number {
  return esquema.filtros.filter((f) => !f.soloUrl && f.id in estado.filtros).length;
}

/** The last page that has rows, never below 1. */
export function paginaMaxima(total: number, tamano: number): number {
  return Math.max(1, Math.ceil(total / tamano));
}

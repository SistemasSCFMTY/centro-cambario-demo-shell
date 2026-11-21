import { URL_API } from '@data/constants/api.constants';
import { OperacionListaDto } from '@data/dto/operaciones.dto';
import { DefinicionFiltro } from '@data/interfaces/definicion-filtro';
import { OpcionFiltro } from '@data/interfaces/opcion-filtro';
import { OrdenLista } from '@data/interfaces/orden-lista';
import { PestanaDetalle } from '@data/interfaces/pestana-detalle';
import { ColumnaTabla } from '@data/types/tabla.types';
import { VistaOperaciones } from '@data/types/vista-operaciones.types';
import { OperacionesStateModel } from '@store/operaciones/types/operaciones.types';

/** operaciones API paths. */
export const RUTAS_OPERACIONES = {
  lista: `${URL_API}/operaciones`,
  /** `…/operaciones/:id` */
  detalle: `${URL_API}/operaciones/`,
} as const;

export const OPERACIONES_INICIAL: OperacionesStateModel = {
  pagina: null,
  detalle: null,
  sucursales: [],
  cajeros: [],
  divisas: [],
  noEncontrada: false,
  cargando: false,
  error: null,
};

/** The tab shown when the URL names none. */
export const VISTA_INICIAL_OPERACIONES: VistaOperaciones = 'hoy';

export const PESTANAS_VISTA_OPERACIONES: readonly (PestanaDetalle & { id: VistaOperaciones })[] = [
  { id: 'hoy', etiqueta: 'Hoy' },
  { id: 'pendientes', etiqueta: 'Pendientes de autorización' },
  { id: 'todas', etiqueta: 'Todas' },
];

export const ORDEN_INICIAL_OPERACIONES: OrdenLista = {
  columna: 'fechaOperacion',
  direccion: 'desc',
};

export const ORDENABLES_OPERACIONES: readonly string[] = [
  'fechaOperacion',
  'folio',
  'sucursal',
  'tipo',
  'montoMxn',
  'estatus',
];

const OPCIONES_TIPO: OpcionFiltro[] = [
  { valor: 'COMPRA', etiqueta: 'Compra' },
  { valor: 'VENTA', etiqueta: 'Venta' },
];

const OPCIONES_ESTATUS: OpcionFiltro[] = [
  { valor: 'COMPLETADA', etiqueta: 'Completada' },
  { valor: 'PENDIENTE_AUTORIZACION', etiqueta: 'Pendiente de autorización' },
  { valor: 'RECHAZADA', etiqueta: 'No realizada' },
  { valor: 'CANCELADA', etiqueta: 'Cancelada' },
];

/** The three filters whose options come from the catalogs: the page adds `opciones` once they load. */
export const FILTRO_SUCURSAL_OPERACIONES: DefinicionFiltro = {
  id: 'sucursal',
  etiqueta: 'Sucursal',
  tipo: 'seleccion',
};
export const FILTRO_CAJERO_OPERACIONES: DefinicionFiltro = {
  id: 'cajero',
  etiqueta: 'Cajero',
  tipo: 'seleccion',
};
export const FILTRO_DIVISA_OPERACIONES: DefinicionFiltro = {
  id: 'divisa',
  etiqueta: 'Divisa',
  tipo: 'seleccion',
};

/** Filters before `sucursal` / `cajero` / `divisa` in the popover, and the ones after them. */
export const FILTROS_INICIALES_OPERACIONES: readonly DefinicionFiltro[] = [
  {
    id: 'vista',
    etiqueta: 'Vista',
    tipo: 'seleccion',
    soloUrl: true,
    opciones: [
      { valor: 'hoy', etiqueta: 'Hoy' },
      { valor: 'pendientes', etiqueta: 'Pendientes de autorización' },
      { valor: 'todas', etiqueta: 'Todas' },
    ],
  },
  { id: 'desde', etiqueta: 'Desde', tipo: 'fecha' },
  { id: 'hasta', etiqueta: 'Hasta', tipo: 'fecha' },
];

export const FILTROS_FINALES_OPERACIONES: readonly DefinicionFiltro[] = [
  { id: 'tipo', etiqueta: 'Tipo de operación', tipo: 'seleccion', opciones: OPCIONES_TIPO },
  { id: 'estatus', etiqueta: 'Estatus', tipo: 'seleccion', opciones: OPCIONES_ESTATUS },
];

/** Columns of the list. Cells with a format are templates in the page (`appCeldaTabla`). */
/**
 * Folio is pinned and Estatus comes right after it, so the hold and its motivo are on screen at
 * 1366 px; Importe carries the amount, the rate and the pesos in one two-line cell (sorted by pesos).
 * The USD equivalent lives on the detail (lead, 2026-11-20).
 */
export const COLUMNAS_OPERACIONES: ColumnaTabla<OperacionListaDto>[] = [
  { accessorKey: 'folio', header: 'Folio', meta: { numerica: false, pinned: true } },
  { accessorKey: 'estatus', header: 'Estatus', meta: { numerica: false } },
  { accessorKey: 'fechaOperacion', header: 'Fecha', meta: { numerica: false } },
  { accessorKey: 'sucursal', header: 'Sucursal', meta: { numerica: false } },
  { accessorKey: 'tipo', header: 'Operación', meta: { numerica: false } },
  { accessorKey: 'montoMxn', header: 'Importe', meta: { numerica: true } },
  { accessorKey: 'cliente', header: 'Cliente', meta: { numerica: false }, enableSorting: false },
];

export const TEXTO_VACIO_OPERACIONES: Record<VistaOperaciones, string> = {
  hoy: 'Hoy no se ha registrado ninguna operación.',
  pendientes: 'No hay operaciones pendientes de autorización.',
  todas: 'Aún no hay operaciones registradas.',
};

export const TEXTO_VACIO_CON_FILTROS_OPERACIONES = 'Ninguna operación cumple con los filtros.';

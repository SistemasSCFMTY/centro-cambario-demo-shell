import { URL_API } from '@data/constants/api.constants';
import { AjustePill } from '@data/interfaces/ajuste-pill';
import { EsquemaLista } from '@data/interfaces/esquema-lista';
import { OpcionFiltro } from '@data/interfaces/opcion-filtro';
import {
  ClaseMovimiento,
  EstadoPasoMovimiento,
  EstatusMovimiento,
} from '@data/types/movimiento.types';
import { MovimientosStateModel } from '@store/movimientos/types/movimientos.types';

/** movimientos API paths. */
export const RUTAS_MOVIMIENTOS = {
  lista: `${URL_API}/movimientos`,
  /** The filtered list as a file. */
  exportacion: `${URL_API}/movimientos/exportacion`,
  /** `…/movimientos/:id` */
  detalle: `${URL_API}/movimientos/`,
  /** `…/movimientos/:id/aprobacion` */
  aprobacion: 'aprobacion',
  /** `…/movimientos/:id/rechazo` */
  rechazo: 'rechazo',
} as const;

export const MOVIMIENTOS_INICIAL: MovimientosStateModel = {
  pagina: null,
  detalle: null,
  sucursales: [],
  cargandoLista: false,
  cargandoDetalle: false,
  exportando: false,
  guardando: false,
  errorLista: null,
  errorDetalle: null,
  errorRevision: null,
};

export const ETIQUETA_CLASE_MOVIMIENTO: Record<ClaseMovimiento, string> = {
  TRASPASO: 'Traspaso',
  TRASLADO_VALORES: 'Traslado de valores',
  DOTACION: 'Dotación',
};

/** Lucide glyph of each class, for the lead cell of the list. All are registered by `app-celda-principal`. */
export const ICONO_CLASE_MOVIMIENTO: Record<ClaseMovimiento, string> = {
  TRASPASO: 'lucideArrowLeftRight',
  TRASLADO_VALORES: 'lucideTruck',
  DOTACION: 'lucideBanknote',
};

export const PILL_ESTATUS_MOVIMIENTO: Record<EstatusMovimiento, AjustePill> = {
  EN_TRANSITO: { tono: 'info', etiqueta: 'En tránsito' },
  RECIBIDO: { tono: 'success', etiqueta: 'Recibido' },
  CANCELADO: { tono: 'neutral', etiqueta: 'Cancelado' },
  PENDIENTE_APROBACION: { tono: 'warning', etiqueta: 'Pendiente de aprobación' },
  APROBADA: { tono: 'success', etiqueta: 'Aprobada' },
  RECHAZADA: { tono: 'danger', etiqueta: 'Rechazada' },
};

/** Who did the last step, by the status it left. */
export const ETIQUETA_RESOLUCION_MOVIMIENTO: Record<EstatusMovimiento, string> = {
  EN_TRANSITO: 'Resolvió',
  PENDIENTE_APROBACION: 'Resolvió',
  RECIBIDO: 'Recibió',
  CANCELADO: 'Canceló',
  APROBADA: 'Aprobó',
  RECHAZADA: 'Rechazó',
};

/** Label of the date of the last step, by the status it left. */
export const ETIQUETA_FECHA_RESOLUCION_MOVIMIENTO: Record<EstatusMovimiento, string> = {
  EN_TRANSITO: 'Fecha de resolución',
  PENDIENTE_APROBACION: 'Fecha de resolución',
  RECIBIDO: 'Fecha de recepción',
  CANCELADO: 'Fecha de cancelación',
  APROBADA: 'Fecha de aprobación',
  RECHAZADA: 'Fecha de rechazo',
};

/** Dot of each step of the status trail. */
export const CLASE_PUNTO_PASO: Record<EstadoPasoMovimiento, string> = {
  hecho: 'bg-success-500',
  pendiente: 'bg-warning-500',
  negativo: 'bg-danger-500',
};

/** The quick views of the list; `todos` is the unfiltered list and has no `vista` param. */
export const VISTAS_MOVIMIENTOS: readonly OpcionFiltro[] = [
  { valor: 'todos', etiqueta: 'Todos' },
  { valor: 'traspasos', etiqueta: 'Traspasos' },
  { valor: 'traslados', etiqueta: 'Traslados de valores' },
  { valor: 'dotaciones', etiqueta: 'Dotaciones' },
  { valor: 'por-aprobar', etiqueta: 'Por aprobar' },
];

const OPCIONES_ESTATUS_MOVIMIENTO: OpcionFiltro[] = [
  { valor: 'EN_TRANSITO', etiqueta: 'En tránsito' },
  { valor: 'RECIBIDO', etiqueta: 'Recibido' },
  { valor: 'CANCELADO', etiqueta: 'Cancelado' },
  { valor: 'PENDIENTE_APROBACION', etiqueta: 'Pendiente de aprobación' },
  { valor: 'APROBADA', etiqueta: 'Aprobada' },
  { valor: 'RECHAZADA', etiqueta: 'Rechazada' },
];

const OPCIONES_DIVISA_MOVIMIENTO: OpcionFiltro[] = [
  { valor: 'MXN', etiqueta: 'MXN' },
  { valor: 'USD', etiqueta: 'USD' },
  { valor: 'EUR', etiqueta: 'EUR' },
  { valor: 'JPY', etiqueta: 'JPY' },
  { valor: 'CNY', etiqueta: 'CNY' },
  { valor: 'KRW', etiqueta: 'KRW' },
];

/**
 * What the list accepts in its URL. The sucursal filter has no `opciones` here: the page adds
 * them from the catalog once it loads.
 */
export const ESQUEMA_MOVIMIENTOS: EsquemaLista = {
  tamanos: [10, 25, 50],
  tamanoInicial: 25,
  ordenables: ['folio', 'fecha', 'estatus'],
  ordenInicial: { columna: 'fecha', direccion: 'desc' },
  filtros: [
    {
      id: 'vista',
      etiqueta: 'Vista',
      tipo: 'seleccion',
      soloUrl: true,
      opciones: [
        { valor: 'traspasos', etiqueta: 'Traspasos' },
        { valor: 'traslados', etiqueta: 'Traslados de valores' },
        { valor: 'dotaciones', etiqueta: 'Dotaciones' },
        { valor: 'por-aprobar', etiqueta: 'Por aprobar' },
      ],
    },
    { id: 'desde', etiqueta: 'Desde', tipo: 'fecha' },
    { id: 'hasta', etiqueta: 'Hasta', tipo: 'fecha' },
    { id: 'sucursal', etiqueta: 'Sucursal', tipo: 'seleccion' },
    { id: 'divisa', etiqueta: 'Divisa', tipo: 'seleccion', opciones: OPCIONES_DIVISA_MOVIMIENTO },
    {
      id: 'estatus',
      etiqueta: 'Estatus',
      tipo: 'seleccion',
      opciones: OPCIONES_ESTATUS_MOVIMIENTO,
    },
    { id: 'folio', etiqueta: 'Folio', tipo: 'texto' },
  ],
};

/** Header row of the exported file. */
export const ENCABEZADOS_EXPORTACION_MOVIMIENTOS: readonly string[] = [
  'Folio',
  'Tipo',
  'Estatus',
  'Fecha',
  'Origen',
  'Destino',
  'Divisa',
  'Monto',
  'Solicitó',
  'Resolvió',
  'Observaciones',
  'Nota de resolución',
];

/** Why a review was refused by the server, as the page words it. */
export const MENSAJE_ERROR_REVISION: Record<string, string> = {
  MOVIMIENTO_NO_PENDIENTE: 'Esta dotación ya fue revisada. Actualice la página para ver su estado.',
  MONTOS_INVALIDOS:
    'Revise los montos: al menos uno debe ser mayor a cero y respetar los decimales de su divisa.',
  MOTIVO_REQUERIDO: 'Escriba el motivo del rechazo.',
  SIN_PERMISO: 'Solo un superadministrador puede revisar dotaciones.',
  MOVIMIENTO_NO_ENCONTRADO: 'No encontramos este movimiento.',
};

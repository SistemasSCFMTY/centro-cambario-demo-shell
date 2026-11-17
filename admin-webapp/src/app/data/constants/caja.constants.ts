import { URL_API } from '@data/constants/api.constants';
import { TAMANOS_PAGINA, TAMANO_PAGINA_INICIAL } from '@data/constants/lista.constants';
import { AjustePill } from '@data/interfaces/ajuste-pill';
import { EsquemaLista } from '@data/interfaces/esquema-lista';
import { OpcionFiltro } from '@data/interfaces/opcion-filtro';
import { TipoConteo } from '@data/types/conteo-caja.types';
import { CodigoDivisa } from '@data/types/divisa.types';
import { CajaStateModel } from '@store/caja/types/caja.types';

/** caja API paths. */
export const RUTAS_CAJA = {
  lista: `${URL_API}/cajas`,
  conteos: `${URL_API}/cajas/conteos`,
  opciones: `${URL_API}/cajas/opciones`,
} as const;

export const CAJA_INICIAL: CajaStateModel = {
  cajas: null,
  conteos: null,
  sucursales: [],
  opcionesCajas: [],
  cargandoCajas: false,
  cargandoConteos: false,
  errorCajas: null,
  errorConteos: null,
};

/** Smallest difference that counts: below it a count cuadra (same threshold as the demo). */
export const CUADRA_CAJA = 0.005;

/** The currencies a caja holds, one balance column each, in catalog order. */
export const DIVISAS_CAJA: readonly CodigoDivisa[] = ['MXN', 'USD', 'EUR', 'JPY', 'CNY', 'KRW'];

/** Pill of each conteo: arqueo is the mid-shift review, so it takes the warning tone. */
export const PILL_TIPO_CONTEO: Record<TipoConteo, AjustePill> = {
  APERTURA: { tono: 'info', etiqueta: 'Apertura' },
  ARQUEO: { tono: 'warning', etiqueta: 'Arqueo' },
  CORTE: { tono: 'neutral', etiqueta: 'Corte' },
};

/** What the conteos mean, always shown under the list (same wording as the demo). */
export const NOTA_CONTEOS =
  'La apertura fija el saldo inicial de la caja. El corte fija el saldo final y su diferencia se carga al responsable. El arqueo es una revisión durante el turno: su diferencia se aclara y se ajusta en el corte.';

export const OPCIONES_TIPO_CONTEO: readonly OpcionFiltro[] = [
  { valor: 'APERTURA', etiqueta: 'Aperturas (saldo inicial)' },
  { valor: 'ARQUEO', etiqueta: 'Arqueos' },
  { valor: 'CORTE', etiqueta: 'Cortes (saldo final)' },
];

export const OPCIONES_SOLO_DIFERENCIAS: readonly OpcionFiltro[] = [
  { valor: '1', etiqueta: 'Solo con diferencias' },
];

/** The sucursal filter takes its options from the catalog once it loads. */
export const ESQUEMA_CAJAS: EsquemaLista = {
  tamanos: TAMANOS_PAGINA,
  tamanoInicial: TAMANO_PAGINA_INICIAL,
  ordenables: ['caja', 'estatus', ...DIVISAS_CAJA],
  ordenInicial: { columna: 'caja', direccion: 'asc' },
  filtros: [{ id: 'sucursal', etiqueta: 'Sucursal', tipo: 'seleccion' }],
};

/** The caja filter takes its options from the cajas catalog once it loads. */
export const ESQUEMA_CONTEOS: EsquemaLista = {
  tamanos: TAMANOS_PAGINA,
  tamanoInicial: TAMANO_PAGINA_INICIAL,
  ordenables: ['fecha', 'tipo', 'caja'],
  ordenInicial: { columna: 'fecha', direccion: 'desc' },
  filtros: [
    { id: 'caja', etiqueta: 'Caja', tipo: 'seleccion' },
    { id: 'tipo', etiqueta: 'Tipo', tipo: 'seleccion', opciones: [...OPCIONES_TIPO_CONTEO] },
    {
      id: 'diferencias',
      etiqueta: 'Diferencias',
      tipo: 'seleccion',
      opciones: [...OPCIONES_SOLO_DIFERENCIAS],
    },
  ],
};

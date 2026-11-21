import { URL_API } from '@data/constants/api.constants';
import { TAMANO_PAGINA_INICIAL, TAMANOS_PAGINA } from '@data/constants/lista.constants';
import { AjustePill } from '@data/interfaces/ajuste-pill';
import { EsquemaLista } from '@data/interfaces/esquema-lista';
import { PestanaDetalle } from '@data/interfaces/pestana-detalle';
import { TipoPep, TipoPersona } from '@data/types/cliente.types';
import { NivelExpediente } from '@data/types/operacion.types';
import { ClientesStateModel } from '@store/clientes/types/clientes.types';

/** clientes API paths. */
export const RUTAS_CLIENTES = {
  lista: `${URL_API}/clientes`,
  /** `…/clientes/:id` */
  detalle: `${URL_API}/clientes/`,
  /** Appended to `…/clientes/:id`. */
  sufijoOperaciones: '/operaciones',
} as const;

/** Latest operaciones the cliente detail lists. */
export const OPERACIONES_RECIENTES = 10;

export const CLIENTES_INICIAL: ClientesStateModel = {
  pagina: null,
  detalle: null,
  operaciones: null,
  cargando: false,
  cargandoOperaciones: false,
  error: null,
  detalleNoEncontrado: false,
  errorOperaciones: null,
};

/** What the clientes list accepts in its URL (plans/03 D-3/D-10: the risk filter stays hidden). */
export const ESQUEMA_LISTA_CLIENTES: EsquemaLista = {
  tamanos: TAMANOS_PAGINA,
  tamanoInicial: TAMANO_PAGINA_INICIAL,
  ordenables: [
    'numeroCliente',
    'nombreCompleto',
    'fechaBase',
    'nivelExpediente',
    'estatus',
    'fechaAlta',
  ],
  ordenInicial: { columna: 'fechaAlta', direccion: 'desc' },
  filtros: [
    { id: 'busqueda', etiqueta: 'Buscar cliente', tipo: 'texto' },
    {
      id: 'tipoPersona',
      etiqueta: 'Tipo de persona',
      tipo: 'seleccion',
      opciones: [
        { valor: 'PF', etiqueta: 'Persona física' },
        { valor: 'PM', etiqueta: 'Persona moral' },
      ],
    },
    {
      id: 'nivel',
      etiqueta: 'Expediente',
      tipo: 'seleccion',
      opciones: [
        { valor: '1', etiqueta: 'Nivel 1' },
        { valor: '2', etiqueta: 'Nivel 2' },
        { valor: '3', etiqueta: 'Nivel 3' },
      ],
    },
    {
      id: 'estatus',
      etiqueta: 'Estatus',
      tipo: 'seleccion',
      opciones: [
        { valor: 'ACTIVO', etiqueta: 'Activo' },
        { valor: 'SUSPENDIDO', etiqueta: 'Suspendido' },
        { valor: 'BLOQUEADO', etiqueta: 'Bloqueado' },
      ],
    },
  ],
};

/** Pill of the expediente level. */
/** The expediente level is an attribute, not a judgment: one neutral tone for all (lead, 2026-11-20). */
export const PILL_NIVEL_EXPEDIENTE: Record<NivelExpediente, AjustePill> = {
  0: { tono: 'neutral', etiqueta: 'Sin identificación' },
  1: { tono: 'neutral', etiqueta: 'Nivel 1' },
  2: { tono: 'neutral', etiqueta: 'Nivel 2' },
  3: { tono: 'neutral', etiqueta: 'Nivel 3' },
};

export const ETIQUETA_TIPO_PEP: Record<TipoPep, string> = {
  NACIONAL: 'PEP nacional',
  EXTRANJERA: 'PEP extranjera',
};

export const PILL_COTEJADO: Record<'si' | 'no', AjustePill> = {
  si: { tono: 'success', etiqueta: 'Sí' },
  no: { tono: 'warning', etiqueta: 'No' },
};

export const PILL_REQUISITO_NIVEL: Record<'completo' | 'pendiente', AjustePill> = {
  completo: { tono: 'success', etiqueta: 'Completo' },
  pendiente: { tono: 'neutral', etiqueta: 'Pendiente' },
};

/** Tabs of the cliente detail (plans/03 D-11); the shell adds Auditoría after them. */
export const PESTANAS_CLIENTE: readonly PestanaDetalle[] = [
  { id: 'general', etiqueta: 'General' },
  { id: 'movimientos', etiqueta: 'Movimientos de efectivo' },
  { id: 'representantes', etiqueta: 'Representantes legales' },
  { id: 'beneficiarios', etiqueta: 'Beneficiarios' },
  { id: 'operaciones', etiqueta: 'Operaciones' },
  { id: 'documentos', etiqueta: 'Documentos' },
  { id: 'pep', etiqueta: 'Declaración PEP' },
];

/** Tabs that only a persona moral has. */
export const PESTANAS_SOLO_PM: readonly string[] = ['representantes'];

/** What each expediente level asks for (plans/03 §2), by tipo de persona. */
export const REQUISITOS_NIVEL: Record<TipoPersona, Record<1 | 2 | 3, readonly string[]>> = {
  PF: {
    1: [
      'Nombre, fecha y país de nacimiento, nacionalidad y condición de estancia',
      'Identificación oficial',
      'Domicilio',
      'Antecedentes',
    ],
    2: ['Copia de la identificación oficial'],
    3: [
      'Género, entidad de nacimiento, CURP y RFC o e.firma',
      'Ocupación, localidad, teléfono y correo',
      'PEP, perfil transaccional y declaración de cuenta propia',
      'Constancia de CURP, comprobante de domicilio y documento migratorio',
    ],
  },
  PM: {
    1: [
      'Datos de la persona moral, domicilio, teléfono y correo',
      'Representantes, y quien comparece con su identificación',
      'Accionistas y estructura corporativa',
      'Antecedentes',
    ],
    2: ['Copia de la identificación de quien comparece'],
    3: [
      'Propietarios reales, perfil transaccional y localidad',
      'Reciente constitución',
      'Acta constitutiva, escrito de compromiso y cédula fiscal',
      'FIEL, comprobante de domicilio, poder y declaración de propietarios',
    ],
  },
};

export const NIVELES_EXPEDIENTE: readonly (1 | 2 | 3)[] = [1, 2, 3];

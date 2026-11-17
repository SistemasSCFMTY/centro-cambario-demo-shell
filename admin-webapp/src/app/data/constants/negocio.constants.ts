import { URL_API } from '@data/constants/api.constants';
import { DefinicionFiltro } from '@data/interfaces/definicion-filtro';
import { EsquemaLista } from '@data/interfaces/esquema-lista';
import { DatosSucursal } from '@data/interfaces/datos-sucursal-negocio';
import { OpcionFiltro } from '@data/interfaces/opcion-filtro';
import { OpcionFiltroAuditoriaNegocio } from '@data/interfaces/opcion-filtro-auditoria-negocio';
import { PestanaDetalle } from '@data/interfaces/pestana-detalle';
import { SeccionFormulario } from '@data/interfaces/seccion-formulario-negocio';
import { TAMANO_PAGINA_INICIAL, TAMANOS_PAGINA } from '@data/constants/lista.constants';
import { CodigoErrorNegocio, TipoDocumentoLegal } from '@data/types/negocio.types';
import { NegocioStateModel } from '@store/negocio/types/negocio.types';

/** negocio API paths. */
export const RUTAS_NEGOCIO = {
  centro: `${URL_API}/negocio`,
  opciones: `${URL_API}/negocio/opciones`,
  auditoria: `${URL_API}/negocio/auditoria`,
  sucursales: `${URL_API}/negocio/sucursales`,
  /** Followed by the sucursal id (and `/estatus` to dar de baja or reactivar). */
  sucursal: `${URL_API}/negocio/sucursales/`,
} as const;

export const SUFIJO_ESTATUS_SUCURSAL = '/estatus';

export const NEGOCIO_INICIAL: NegocioStateModel = {
  perfil: null,
  opciones: null,
  municipios: [],
  localidades: [],
  auditoria: [],
  sucursales: null,
  sucursal: null,
  cargando: false,
  cargandoAuditoria: false,
  cargandoSucursales: false,
  cargandoSucursal: false,
  guardando: false,
  errorPerfil: null,
  errorOpciones: null,
  errorGeografia: null,
  cargandoGeografia: false,
  errorSucursales: null,
  errorAuditoria: null,
  errorSucursal: null,
  errorGuardado: null,
};

/** Who the simulated backend records as the author of a change (Phase 1 has no token to read). */
export const USUARIO_AUDITORIA_SIMULADO = 'Administrador';

/** Tabs of the negocio page; the shell adds Auditoría after them. */
export const PESTANAS_NEGOCIO: readonly PestanaDetalle[] = [
  { id: 'general', etiqueta: 'General' },
  { id: 'legal', etiqueta: 'Legal' },
  { id: 'sucursales', etiqueta: 'Sucursales' },
];

export const CLAVE_URL_PESTANA_NEGOCIO = 'tab';

export const OPCIONES_FILTRO_AUDITORIA: readonly OpcionFiltroAuditoriaNegocio[] = [
  { valor: 'todos', etiqueta: 'Todo' },
  { valor: 'negocio', etiqueta: 'Negocio' },
  { valor: 'sucursal', etiqueta: 'Sucursales' },
];

export const ETIQUETA_DOCUMENTO_LEGAL: Record<TipoDocumentoLegal, string> = {
  ACTA_CONSTITUTIVA: 'Acta constitutiva',
  PODER_REPRESENTANTE: 'Poder del representante legal',
  CONSTANCIA_FISCAL: 'Constancia de situación fiscal',
  CONSTANCIA_REGISTRO: 'Constancia de registro',
  DICTAMEN_TECNICO: 'Dictamen técnico',
  MANUAL_PLD: 'Manual de PLD',
};

/** Days before the dictamen técnico expires when the Legal tab starts warning. */
export const DIAS_AVISO_VIGENCIA = 60;

/** The same entidades as filter options: the label is what the sucursales store. */
export const OPCIONES_FILTRO_ENTIDAD: OpcionFiltro[] = [
  { valor: 'Aguascalientes', etiqueta: 'Aguascalientes' },
  { valor: 'Baja California', etiqueta: 'Baja California' },
  { valor: 'Baja California Sur', etiqueta: 'Baja California Sur' },
  { valor: 'Campeche', etiqueta: 'Campeche' },
  { valor: 'Coahuila de Zaragoza', etiqueta: 'Coahuila de Zaragoza' },
  { valor: 'Colima', etiqueta: 'Colima' },
  { valor: 'Chiapas', etiqueta: 'Chiapas' },
  { valor: 'Chihuahua', etiqueta: 'Chihuahua' },
  { valor: 'Distrito Federal', etiqueta: 'Distrito Federal' },
  { valor: 'Durango', etiqueta: 'Durango' },
  { valor: 'Guanajuato', etiqueta: 'Guanajuato' },
  { valor: 'Guerrero', etiqueta: 'Guerrero' },
  { valor: 'Hidalgo', etiqueta: 'Hidalgo' },
  { valor: 'Jalisco', etiqueta: 'Jalisco' },
  { valor: 'México', etiqueta: 'México' },
  { valor: 'Michoacán de Ocampo', etiqueta: 'Michoacán de Ocampo' },
  { valor: 'Morelos', etiqueta: 'Morelos' },
  { valor: 'Nayarit', etiqueta: 'Nayarit' },
  { valor: 'Nuevo León', etiqueta: 'Nuevo León' },
  { valor: 'Oaxaca', etiqueta: 'Oaxaca' },
  { valor: 'Puebla', etiqueta: 'Puebla' },
  { valor: 'Querétaro', etiqueta: 'Querétaro' },
  { valor: 'Quintana Roo', etiqueta: 'Quintana Roo' },
  { valor: 'San Luis Potosí', etiqueta: 'San Luis Potosí' },
  { valor: 'Sinaloa', etiqueta: 'Sinaloa' },
  { valor: 'Sonora', etiqueta: 'Sonora' },
  { valor: 'Tabasco', etiqueta: 'Tabasco' },
  { valor: 'Tamaulipas', etiqueta: 'Tamaulipas' },
  { valor: 'Tlaxcala', etiqueta: 'Tlaxcala' },
  { valor: 'Veracruz de Ignacio de la Llave', etiqueta: 'Veracruz de Ignacio de la Llave' },
  { valor: 'Yucatán', etiqueta: 'Yucatán' },
  { valor: 'Zacatecas', etiqueta: 'Zacatecas' },
];

export const OPCIONES_FILTRO_ESTATUS_SUCURSAL: OpcionFiltro[] = [
  { valor: 'ACTIVA', etiqueta: 'Activa' },
  { valor: 'BAJA', etiqueta: 'Baja' },
];

export const FILTROS_SUCURSALES: readonly DefinicionFiltro[] = [
  {
    id: 'estatus',
    etiqueta: 'Estatus',
    tipo: 'seleccion',
    opciones: OPCIONES_FILTRO_ESTATUS_SUCURSAL,
  },
  {
    id: 'entidad',
    etiqueta: 'Entidad federativa',
    tipo: 'seleccion',
    opciones: OPCIONES_FILTRO_ENTIDAD,
  },
];

/** What the Sucursales tab accepts in its URL. */
export const ESQUEMA_SUCURSALES: EsquemaLista = {
  tamanos: TAMANOS_PAGINA,
  tamanoInicial: TAMANO_PAGINA_INICIAL,
  ordenables: ['clave', 'nombre', 'codigoPostal', 'usuarios', 'operaciones', 'estatus'],
  ordenInicial: { columna: 'estatus', direccion: 'asc' },
  filtros: FILTROS_SUCURSALES,
};

export const SUCURSAL_VACIA: DatosSucursal = {
  clave: '',
  nombre: '',
  responsableId: '',
  calle: '',
  numeroExterior: '',
  numeroInterior: '',
  colonia: '',
  codigoPostal: '',
  entidad: '',
  municipio: '',
  localidad: '',
  telefono: '',
  horario: '',
};

/** The query of the link back to the Sucursales tab, after a sucursal form. */
export const PARAMETROS_VOLVER_SUCURSALES = { tab: 'sucursales' } as const;

/** Formats of the official keys and of the sucursal form (plans/04, from the demo). */
export const PATRON_CLAVE_SUCURSAL = /^[A-Z0-9_-]{2,15}$/;
export const PATRON_CODIGO_POSTAL = /^\d{5}$/;
export const PATRON_CLAVE_CASFIM = /^\d{2}-\d{3}$/;
export const PATRON_CLAVE_CENTRO = /^\d{8}$/;
export const PATRON_RFC_MORAL = /^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$/;
export const PATRON_RFC_FISICA = /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/;
export const PATRON_CURP = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
export const PATRON_TELEFONO = /^\d{10}$/;
export const PATRON_SITIO_WEB = /^https?:\/\/\S+\.\S+$/;

/** Messages of a refused change. `{valor}` is filled with what the backend reports. */
export const MENSAJE_ERROR_NEGOCIO: Record<CodigoErrorNegocio, string> = {
  SUCURSAL_NO_ENCONTRADA: 'No encontramos la sucursal.',
  CLAVE_SUCURSAL_DUPLICADA: 'Ya existe una sucursal con la clave {valor}.',
  SUCURSAL_CON_USUARIOS:
    'La sucursal tiene {valor} usuario(s) asignado(s): cámbielos de sucursal antes de darla de baja.',
  ULTIMA_SUCURSAL_ACTIVA: 'Debe quedar al menos una sucursal activa.',
  MATRIZ_INACTIVA: 'La sucursal matriz debe estar activa.',
  MATRIZ_NO_DE_BAJA:
    'No se puede dar de baja la sucursal matriz: elija otra matriz en Editar negocio.',
};

export const MENSAJE_NEGOCIO_GUARDADO = 'Datos del negocio guardados.';
export const MENSAJE_SUCURSAL_CREADA = 'Sucursal agregada.';
export const MENSAJE_SUCURSAL_ACTUALIZADA = 'Sucursal actualizada.';
export const MENSAJE_SUCURSAL_BAJA = 'Sucursal dada de baja.';
export const MENSAJE_SUCURSAL_REACTIVADA = 'Sucursal reactivada.';

export const AVISO_REPORTES_OFICIALES =
  'Datos propios del centro que usan los reportes oficiales: el órgano supervisor y la clave del centro van en las columnas 4 y 5 del formato de 41 columnas, y la clave de la entidad (CASFIM), en el reporte de dólares (.FDE). La localidad y el código postal (columnas 6 y 7) son de la sucursal donde se realizó cada operación.';

export const NOTA_SUCURSALES_REPORTES =
  'El código postal y la localidad de cada sucursal van en las columnas 7 y 6 de los reportes oficiales de las operaciones que se realizan en ella.';

/** Field labels the audit trail shows for each edited field of the profile, the legal data and a sucursal. */
export const ETIQUETA_CAMPO_NEGOCIO: Record<string, string> = {
  nombreComercial: 'Nombre comercial',
  razonSocial: 'Denominación o razón social',
  rfc: 'RFC',
  inicioOperaciones: 'Inicio de operaciones',
  sucursalMatrizId: 'Sucursal matriz',
  calle: 'Calle',
  numeroExterior: 'Número exterior',
  numeroInterior: 'Número interior',
  colonia: 'Colonia',
  municipio: 'Municipio o alcaldía',
  entidad: 'Entidad federativa',
  codigoPostal: 'Código postal',
  localidad: 'Localidad',
  telefono: 'Teléfono',
  correo: 'Correo electrónico',
  sitioWeb: 'Sitio web',
  horario: 'Horario de atención',
  divisas: 'Divisas que opera',
  claveOrganoSupervisor: 'Clave del órgano supervisor',
  claveCentro: 'Clave del centro cambiario',
  claveEntidad: 'Clave de la entidad',
  numeroRegistro: 'Número de registro',
  fechaRegistro: 'Fecha de registro',
  dictamenNumero: 'Dictamen técnico: número',
  dictamenEmision: 'Dictamen técnico: emisión',
  dictamenVigencia: 'Dictamen técnico: vigencia',
  escrituraNumero: 'Escritura constitutiva: número',
  escrituraFecha: 'Escritura constitutiva: fecha',
  notarioNombre: 'Notario: nombre',
  notarioNumero: 'Notario: número',
  notarioEntidad: 'Notario: entidad',
  folioMercantil: 'Folio mercantil',
  representanteNombre: 'Representante legal',
  representanteRfc: 'Representante legal: RFC',
  representanteCurp: 'Representante legal: CURP',
  poderEscrituraNumero: 'Poder: escritura',
  poderFecha: 'Poder: fecha',
  poderNotario: 'Poder: notario',
  oficialUsuarioId: 'Oficial de Cumplimiento',
  oficialFechaDesignacion: 'Oficial de Cumplimiento: designación',
  oficialFechaNotificacion: 'Oficial de Cumplimiento: notificación',
  clave: 'Clave',
  nombre: 'Nombre',
  responsableId: 'Responsable de la sucursal',
};

/** Fields of the edit form: General (centro) and Legal, in the order the page draws them (plans/04). */
export const SECCIONES_FORMULARIO_NEGOCIO: readonly SeccionFormulario[] = [
  {
    id: 'identidad',
    titulo: 'Identidad',
    descripcion: 'Cómo se llama el centro cambiario y cuál es su sucursal matriz.',
    campos: [
      {
        id: 'nombreComercial',
        etiqueta: 'Nombre comercial',
        tipo: 'texto',
        destino: 'centro',
        requerido: true,
        maxLongitud: 80,
        mensajeRequerido: 'Indique el nombre comercial.',
      },
      {
        id: 'razonSocial',
        etiqueta: 'Denominación o razón social',
        tipo: 'texto',
        destino: 'centro',
        requerido: true,
        maxLongitud: 120,
        ayuda: 'Como aparece en el acta constitutiva, sin abreviaturas.',
        mensajeRequerido: 'Indique la denominación o razón social.',
      },
      {
        id: 'rfc',
        etiqueta: 'RFC',
        tipo: 'texto',
        destino: 'centro',
        requerido: true,
        maxLongitud: 12,
        patron: PATRON_RFC_MORAL,
        mayusculas: true,
        dato: true,
        ayuda: '12 caracteres, persona moral.',
        mensajeRequerido: 'Indique el RFC.',
        mensajeFormato: 'El RFC de una persona moral lleva 12 caracteres.',
      },
      {
        id: 'inicioOperaciones',
        etiqueta: 'Inicio de operaciones',
        tipo: 'fecha',
        destino: 'centro',
        requerido: true,
        noFutura: true,
        dato: true,
        mensajeRequerido: 'Indique la fecha de inicio de operaciones.',
      },
      {
        id: 'sucursalMatrizId',
        etiqueta: 'Sucursal matriz',
        tipo: 'seleccion',
        destino: 'centro',
        requerido: true,
        fuenteOpciones: 'sucursales',
        mensajeRequerido: 'Elija la sucursal matriz.',
      },
    ],
  },
  {
    id: 'domicilio',
    titulo: 'Domicilio fiscal',
    descripcion: 'Dirección registrada ante el SAT.',
    campos: [
      {
        id: 'calle',
        etiqueta: 'Calle',
        tipo: 'texto',
        destino: 'centro',
        requerido: true,
        maxLongitud: 80,
        mensajeRequerido: 'Indique la calle.',
      },
      {
        id: 'numeroExterior',
        etiqueta: 'Número exterior',
        tipo: 'texto',
        destino: 'centro',
        requerido: true,
        maxLongitud: 15,
        dato: true,
        mensajeRequerido: 'Indique el número exterior.',
      },
      {
        id: 'numeroInterior',
        etiqueta: 'Número interior',
        tipo: 'texto',
        destino: 'centro',
        nulable: true,
        maxLongitud: 15,
        dato: true,
      },
      {
        id: 'colonia',
        etiqueta: 'Colonia',
        tipo: 'texto',
        destino: 'centro',
        requerido: true,
        maxLongitud: 80,
        mensajeRequerido: 'Indique la colonia.',
      },
      {
        id: 'codigoPostal',
        etiqueta: 'Código postal',
        tipo: 'texto',
        destino: 'centro',
        requerido: true,
        maxLongitud: 5,
        patron: PATRON_CODIGO_POSTAL,
        dato: true,
        mensajeRequerido: 'Indique el código postal.',
        mensajeFormato: 'El código postal lleva 5 dígitos.',
      },
      {
        id: 'entidad',
        etiqueta: 'Entidad federativa',
        tipo: 'seleccion',
        destino: 'centro',
        requerido: true,
        fuenteOpciones: 'entidades',
        mensajeRequerido: 'Elija la entidad federativa.',
      },
      {
        id: 'municipio',
        etiqueta: 'Municipio o alcaldía',
        tipo: 'seleccion',
        destino: 'centro',
        requerido: true,
        fuenteOpciones: 'municipios',
        textoSinOpciones: 'Elija primero la entidad federativa',
        mensajeRequerido: 'Elija el municipio o la alcaldía.',
      },
      {
        id: 'localidad',
        etiqueta: 'Localidad',
        tipo: 'seleccion',
        destino: 'centro',
        requerido: true,
        fuenteOpciones: 'localidades',
        textoSinOpciones: 'Elija primero el municipio',
        ayuda: 'Catálogo de localidades de la CNBV.',
        mensajeRequerido: 'Elija la localidad.',
      },
    ],
  },
  {
    id: 'contacto',
    titulo: 'Contacto',
    descripcion: 'Cómo se comunican con el centro cambiario sus clientes.',
    campos: [
      {
        id: 'telefono',
        etiqueta: 'Teléfono',
        tipo: 'texto',
        destino: 'centro',
        requerido: true,
        maxLongitud: 10,
        patron: PATRON_TELEFONO,
        dato: true,
        mensajeRequerido: 'Indique el teléfono.',
        mensajeFormato: 'El teléfono lleva 10 dígitos.',
      },
      {
        id: 'correo',
        etiqueta: 'Correo electrónico',
        tipo: 'texto',
        destino: 'centro',
        requerido: true,
        maxLongitud: 120,
        correo: true,
        mensajeRequerido: 'Indique el correo electrónico.',
        mensajeFormato: 'Revise el formato del correo.',
      },
      {
        id: 'sitioWeb',
        etiqueta: 'Sitio web',
        tipo: 'texto',
        destino: 'centro',
        nulable: true,
        maxLongitud: 120,
        patron: PATRON_SITIO_WEB,
        ayuda: 'Opcional. Con https://',
        mensajeFormato: 'Escriba la dirección completa, por ejemplo https://ejemplo.mx.',
      },
      {
        id: 'horario',
        etiqueta: 'Horario de atención',
        tipo: 'texto',
        destino: 'centro',
        nulable: true,
        maxLongitud: 80,
        ayuda: 'Opcional. Por ejemplo, Lun–Sáb 9:00–18:00.',
      },
    ],
  },
  {
    id: 'operacion',
    titulo: 'Operación',
    descripcion: 'Las divisas que compra y vende el centro, además del peso mexicano.',
    campos: [
      {
        id: 'divisas',
        etiqueta: 'Divisas que opera',
        tipo: 'divisas',
        destino: 'centro',
        requerido: true,
        completo: true,
        mensajeRequerido: 'Elija al menos una divisa.',
      },
    ],
  },
  {
    id: 'claves-reportes',
    titulo: 'Claves para los reportes oficiales',
    descripcion: 'Las usan los reportes de operaciones relevantes y de dólares en efectivo.',
    campos: [
      {
        id: 'claveOrganoSupervisor',
        etiqueta: 'Clave del órgano supervisor (CASFIM)',
        tipo: 'texto',
        destino: 'legal',
        maxLongitud: 6,
        patron: PATRON_CLAVE_CASFIM,
        dato: true,
        ayuda: 'Como en el CASFIM: 99-999.',
        mensajeFormato: 'La clave va como en el CASFIM: 99-999 (por ejemplo, 40-002).',
      },
      {
        id: 'claveCentro',
        etiqueta: 'Clave del centro cambiario',
        tipo: 'texto',
        destino: 'legal',
        maxLongitud: 8,
        patron: PATRON_CLAVE_CENTRO,
        dato: true,
        ayuda: '8 dígitos: 0 + sector (2) + clave asignada por la CNBV (5).',
        mensajeFormato: 'La clave del centro cambiario lleva 8 dígitos.',
      },
      {
        id: 'claveEntidad',
        etiqueta: 'Clave de la entidad (CASFIM)',
        tipo: 'texto',
        destino: 'legal',
        requerido: true,
        maxLongitud: 6,
        patron: PATRON_CLAVE_CASFIM,
        dato: true,
        ayuda: 'Sector-entidad, 99-999. Va en el reporte de dólares (.FDE).',
        mensajeRequerido: 'Indique la clave de la entidad (CASFIM).',
        mensajeFormato: 'La clave va como en el CASFIM: 99-999 (por ejemplo, 27-001).',
      },
    ],
  },
  {
    id: 'registro',
    titulo: 'Registro y autorización',
    descripcion: 'Registro como centro cambiario y dictamen técnico en materia de PLD.',
    campos: [
      {
        id: 'numeroRegistro',
        etiqueta: 'Número de registro',
        tipo: 'texto',
        destino: 'legal',
        requerido: true,
        maxLongitud: 30,
        dato: true,
        mensajeRequerido: 'Indique el número de registro.',
      },
      {
        id: 'fechaRegistro',
        etiqueta: 'Fecha de registro',
        tipo: 'fecha',
        destino: 'legal',
        requerido: true,
        noFutura: true,
        dato: true,
        mensajeRequerido: 'Indique la fecha de registro.',
      },
      {
        id: 'dictamenNumero',
        etiqueta: 'Dictamen técnico: número',
        tipo: 'texto',
        destino: 'legal',
        nulable: true,
        maxLongitud: 30,
        dato: true,
        ayuda: 'Opcional.',
      },
      {
        id: 'dictamenEmision',
        etiqueta: 'Dictamen técnico: fecha de emisión',
        tipo: 'fecha',
        destino: 'legal',
        nulable: true,
        noFutura: true,
        dato: true,
      },
      {
        id: 'dictamenVigencia',
        etiqueta: 'Dictamen técnico: vigencia',
        tipo: 'fecha',
        destino: 'legal',
        nulable: true,
        noAnteriorA: 'dictamenEmision',
        dato: true,
        mensajeFormato: 'La vigencia no puede ser anterior a la emisión.',
      },
    ],
  },
  {
    id: 'constitucion',
    titulo: 'Constitución',
    descripcion: 'Escritura constitutiva y su inscripción en el Registro Público de Comercio.',
    campos: [
      {
        id: 'escrituraNumero',
        etiqueta: 'Escritura constitutiva: número',
        tipo: 'texto',
        destino: 'legal',
        requerido: true,
        maxLongitud: 30,
        dato: true,
        mensajeRequerido: 'Indique el número de la escritura.',
      },
      {
        id: 'escrituraFecha',
        etiqueta: 'Fecha de la escritura',
        tipo: 'fecha',
        destino: 'legal',
        requerido: true,
        noFutura: true,
        dato: true,
        mensajeRequerido: 'Indique la fecha de la escritura.',
      },
      {
        id: 'notarioNombre',
        etiqueta: 'Notario: nombre',
        tipo: 'texto',
        destino: 'legal',
        requerido: true,
        maxLongitud: 120,
        mensajeRequerido: 'Indique el nombre del notario.',
      },
      {
        id: 'notarioNumero',
        etiqueta: 'Notario: número',
        tipo: 'texto',
        destino: 'legal',
        requerido: true,
        maxLongitud: 10,
        dato: true,
        mensajeRequerido: 'Indique el número de la notaría.',
      },
      {
        id: 'notarioEntidad',
        etiqueta: 'Notario: entidad',
        tipo: 'seleccion',
        destino: 'legal',
        requerido: true,
        fuenteOpciones: 'entidades',
        mensajeRequerido: 'Elija la entidad de la notaría.',
      },
      {
        id: 'folioMercantil',
        etiqueta: 'Folio mercantil',
        tipo: 'texto',
        destino: 'legal',
        requerido: true,
        maxLongitud: 30,
        dato: true,
        mensajeRequerido: 'Indique el folio mercantil.',
      },
    ],
  },
  {
    id: 'representante',
    titulo: 'Representante legal',
    descripcion: 'Quien representa al centro cambiario y el poder con el que actúa.',
    campos: [
      {
        id: 'representanteNombre',
        etiqueta: 'Nombre completo',
        tipo: 'texto',
        destino: 'legal',
        requerido: true,
        maxLongitud: 120,
        ayuda: 'Sin abreviaturas.',
        mensajeRequerido: 'Indique el nombre del representante legal.',
      },
      {
        id: 'representanteRfc',
        etiqueta: 'RFC',
        tipo: 'texto',
        destino: 'legal',
        requerido: true,
        maxLongitud: 13,
        patron: PATRON_RFC_FISICA,
        mayusculas: true,
        dato: true,
        mensajeRequerido: 'Indique el RFC del representante legal.',
        mensajeFormato: 'El RFC de una persona física lleva 13 caracteres.',
      },
      {
        id: 'representanteCurp',
        etiqueta: 'CURP',
        tipo: 'texto',
        destino: 'legal',
        requerido: true,
        maxLongitud: 18,
        patron: PATRON_CURP,
        mayusculas: true,
        dato: true,
        mensajeRequerido: 'Indique la CURP del representante legal.',
        mensajeFormato: 'La CURP lleva 18 caracteres.',
      },
      {
        id: 'poderEscrituraNumero',
        etiqueta: 'Poder: escritura número',
        tipo: 'texto',
        destino: 'legal',
        requerido: true,
        maxLongitud: 30,
        dato: true,
        mensajeRequerido: 'Indique el número de la escritura del poder.',
      },
      {
        id: 'poderFecha',
        etiqueta: 'Poder: fecha',
        tipo: 'fecha',
        destino: 'legal',
        requerido: true,
        noFutura: true,
        dato: true,
        mensajeRequerido: 'Indique la fecha del poder.',
      },
      {
        id: 'poderNotario',
        etiqueta: 'Poder: notario',
        tipo: 'texto',
        destino: 'legal',
        requerido: true,
        maxLongitud: 120,
        mensajeRequerido: 'Indique el notario del poder.',
      },
    ],
  },
  {
    id: 'oficial',
    titulo: 'Oficial de Cumplimiento',
    descripcion: 'El usuario designado y las fechas de su designación.',
    campos: [
      {
        id: 'oficialUsuarioId',
        etiqueta: 'Usuario designado',
        tipo: 'seleccion',
        destino: 'legal',
        requerido: true,
        fuenteOpciones: 'usuarios',
        mensajeRequerido: 'Elija al Oficial de Cumplimiento.',
      },
      {
        id: 'oficialFechaDesignacion',
        etiqueta: 'Fecha de designación',
        tipo: 'fecha',
        destino: 'legal',
        requerido: true,
        noFutura: true,
        dato: true,
        mensajeRequerido: 'Indique la fecha de designación.',
      },
      {
        id: 'oficialFechaNotificacion',
        etiqueta: 'Fecha de notificación a la autoridad',
        tipo: 'fecha',
        destino: 'legal',
        nulable: true,
        noAnteriorA: 'oficialFechaDesignacion',
        dato: true,
        ayuda: 'Opcional.',
        mensajeFormato: 'La notificación no puede ser anterior a la designación.',
      },
    ],
  },
];

/** Fields of the sucursal form (alta and corrección): the demo's rules plus plans/04's domicilio and responsable. */
export const SECCIONES_FORMULARIO_SUCURSAL: readonly SeccionFormulario[] = [
  {
    id: 'identificacion',
    titulo: 'Identificación',
    descripcion: 'La clave identifica a la sucursal en los reportes y no se repite.',
    campos: [
      {
        id: 'clave',
        etiqueta: 'Clave',
        tipo: 'texto',
        requerido: true,
        maxLongitud: 15,
        patron: PATRON_CLAVE_SUCURSAL,
        mayusculas: true,
        dato: true,
        ayuda: 'De 2 a 15 letras, números, guion o guion bajo.',
        mensajeRequerido: 'La clave lleva de 2 a 15 letras, números, guion o guion bajo.',
        mensajeFormato: 'La clave lleva de 2 a 15 letras, números, guion o guion bajo.',
      },
      {
        id: 'nombre',
        etiqueta: 'Nombre',
        tipo: 'texto',
        requerido: true,
        maxLongitud: 60,
        mensajeRequerido: 'Indique el nombre de la sucursal.',
      },
      {
        id: 'responsableId',
        etiqueta: 'Responsable de la sucursal',
        tipo: 'seleccion',
        fuenteOpciones: 'responsables',
        ayuda: 'Opcional. El usuario a cargo de la sucursal.',
      },
    ],
  },
  {
    id: 'ubicacion',
    titulo: 'Domicilio y reportes',
    descripcion:
      'El código postal y la localidad van en las columnas 7 y 6 de los reportes oficiales de las operaciones de la sucursal.',
    campos: [
      {
        id: 'calle',
        etiqueta: 'Calle',
        tipo: 'texto',
        requerido: true,
        maxLongitud: 80,
        mensajeRequerido: 'Indique la calle.',
      },
      {
        id: 'numeroExterior',
        etiqueta: 'Número exterior',
        tipo: 'texto',
        requerido: true,
        maxLongitud: 15,
        dato: true,
        mensajeRequerido: 'Indique el número exterior.',
      },
      {
        id: 'numeroInterior',
        etiqueta: 'Número interior',
        tipo: 'texto',
        maxLongitud: 15,
        dato: true,
      },
      {
        id: 'colonia',
        etiqueta: 'Colonia',
        tipo: 'texto',
        requerido: true,
        maxLongitud: 80,
        mensajeRequerido: 'Indique la colonia.',
      },
      {
        id: 'codigoPostal',
        etiqueta: 'Código postal',
        tipo: 'texto',
        maxLongitud: 5,
        patron: PATRON_CODIGO_POSTAL,
        dato: true,
        ayuda: '5 dígitos. Columna 7 de los reportes oficiales.',
        mensajeFormato: 'El código postal lleva 5 dígitos.',
      },
      {
        id: 'entidad',
        etiqueta: 'Entidad federativa',
        tipo: 'seleccion',
        requerido: true,
        fuenteOpciones: 'entidades',
        mensajeRequerido: 'Elija la entidad federativa.',
      },
      {
        id: 'municipio',
        etiqueta: 'Municipio o alcaldía',
        tipo: 'seleccion',
        requerido: true,
        fuenteOpciones: 'municipios',
        textoSinOpciones: 'Elija primero la entidad federativa',
        mensajeRequerido: 'Elija el municipio o la alcaldía.',
      },
      {
        id: 'localidad',
        etiqueta: 'Localidad',
        tipo: 'seleccion',
        fuenteOpciones: 'localidades',
        textoSinOpciones: 'Elija primero el municipio',
        ayuda: 'Opcional. Columna 6 de los reportes oficiales.',
      },
    ],
  },
  {
    id: 'contacto',
    titulo: 'Contacto',
    descripcion: 'Cómo localizar a la sucursal y cuándo atiende.',
    campos: [
      {
        id: 'telefono',
        etiqueta: 'Teléfono',
        tipo: 'texto',
        maxLongitud: 10,
        patron: PATRON_TELEFONO,
        dato: true,
        mensajeFormato: 'El teléfono lleva 10 dígitos.',
      },
      {
        id: 'horario',
        etiqueta: 'Horario de atención',
        tipo: 'texto',
        maxLongitud: 80,
        ayuda: 'Por ejemplo, Lun–Sáb 9:00–18:00.',
      },
    ],
  },
];

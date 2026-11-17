import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { ENTIDADES_FEDERATIVAS } from '@data/constants/catalogos.constants';
import {
  ETIQUETA_CAMPO_NEGOCIO,
  RUTAS_NEGOCIO,
  SUFIJO_ESTATUS_SUCURSAL,
  USUARIO_AUDITORIA_SIMULADO,
} from '@data/constants/negocio.constants';
import { EstatusSucursalDto } from '@data/dto/negocio-estatus-sucursal.dto';
import { GuardarNegocioDto } from '@data/dto/negocio-guardar.dto';
import { PerfilNegocioDto } from '@data/dto/negocio-perfil.dto';
import { AUDITORIA } from '@data/fixtures/auditoria.fixture';
import { CAJEROS } from '@data/fixtures/cajeros.fixture';
import { DIVISAS } from '@data/fixtures/divisas.fixture';
import { CENTRO_CAMBIARIO, SUCURSALES } from '@data/fixtures/negocio.fixture';
import { DATOS_LEGALES, DOCUMENTOS_LEGALES } from '@data/fixtures/negocio-legal.fixture';
import { OPERACIONES } from '@data/fixtures/operaciones.fixture';
import { USUARIOS_PRUEBA } from '@data/fixtures/usuarios.fixture';
import { CambioAuditoria } from '@data/interfaces/cambio-auditoria';
import { CentroCambiario } from '@data/interfaces/centro-cambiario';
import { DatosLegales } from '@data/interfaces/datos-legales-negocio';
import { DatosSucursal } from '@data/interfaces/datos-sucursal-negocio';
import { ManejadorApi } from '@data/interfaces/manejador-api';
import { OpcionCatalogo } from '@data/interfaces/opcion-catalogo';
import { OpcionesNegocio } from '@data/interfaces/opciones-negocio';
import { RegistroAuditoria } from '@data/interfaces/registro-auditoria';
import { Sucursal } from '@data/interfaces/sucursal';
import { SucursalResumen } from '@data/interfaces/sucursal-resumen-negocio';
import { CodigoErrorNegocio } from '@data/types/negocio.types';
import { RespuestaSimulada } from '@data/types/simulacion.types';
import { descripcionDeLocalidad } from '@utils/catalogos/geografia';
import { cargarLocalidades } from '@interceptors/simulacion-api/catalogos-geograficos';
import { idDeRuta, parametrosPlanos, responderOk } from '@interceptors/simulacion-api/respuestas';
import { fechaHoraLocalIso } from '@utils/fechas/fechas';
import { consultaDeParametros, paginar } from '@utils/lista/consulta-lista';
import { normalizar } from '@utils/texto/normalizar';

/** The simulated server's memory: edits live until the page is reloaded (Phase 1). */
let centro: CentroCambiario = { ...CENTRO_CAMBIARIO };
let legal: DatosLegales = { ...DATOS_LEGALES };
let sucursales: Sucursal[] = SUCURSALES.map((s) => ({ ...s }));
let auditoria: RegistroAuditoria[] = AUDITORIA.filter(
  (a) => a.entidad === 'negocio' || a.entidad === 'sucursal',
).map((a) => ({ ...a }));
let contadorAuditoria = 0;

/** The simulated server's sucursales right now (altas, ediciones and bajas included), for the catalogs. */
export function sucursalesActuales(): readonly Sucursal[] {
  return sucursales;
}

function rechazar(
  solicitud: HttpRequest<unknown>,
  status: number,
  codigo: CodigoErrorNegocio,
  valor?: string | number,
): never {
  throw new HttpErrorResponse({ status, url: solicitud.url, error: { codigo, valor } });
}

function resumen(sucursal: Sucursal): SucursalResumen {
  return {
    ...sucursal,
    usuarios: CAJEROS.filter((c) => c.sucursalId === sucursal.id).length,
    operaciones: OPERACIONES.filter((o) => o.sucursalId === sucursal.id).length,
  };
}

function perfil(): PerfilNegocioDto {
  return { centro, legal, documentos: [...DOCUMENTOS_LEGALES] };
}

function responsables(): OpcionCatalogo[] {
  return [
    ...USUARIOS_PRUEBA.map((u) => ({ clave: u.id, etiqueta: u.nombre })),
    ...CAJEROS.filter((c) => c.activo).map((c) => ({ clave: c.id, etiqueta: c.nombreCompleto })),
  ];
}

function nombreDeUsuario(id: string): string | null {
  return responsables().find((r) => r.clave === id)?.etiqueta ?? null;
}

/** How a stored value reads in the audit trail. */
function mostrar(campo: string, valor: unknown): string | null {
  if (valor === null || valor === undefined || valor === '') return null;
  if (Array.isArray(valor)) return valor.join(', ');
  if (campo === 'sucursalMatrizId') return sucursales.find((s) => s.id === valor)?.nombre ?? null;
  if (campo === 'oficialUsuarioId') {
    return USUARIOS_PRUEBA.find((u) => u.id === valor)?.nombre ?? null;
  }
  if (campo === 'responsableId') return nombreDeUsuario(String(valor));
  return String(valor);
}

function cambiosEntre(antes: object, despues: object): CambioAuditoria[] {
  const previo = antes as Record<string, unknown>;
  const nuevo = despues as Record<string, unknown>;
  return Object.keys(nuevo)
    .filter((campo) => campo in ETIQUETA_CAMPO_NEGOCIO)
    .map((campo) => ({
      campo: ETIQUETA_CAMPO_NEGOCIO[campo],
      antes: mostrar(campo, previo[campo]),
      despues: mostrar(campo, nuevo[campo]),
    }))
    .filter((cambio) => cambio.antes !== cambio.despues);
}

function registrar(
  entidad: 'negocio' | 'sucursal',
  entidadId: string,
  accion: string,
  detalle: string | null,
  cambios: CambioAuditoria[],
): void {
  contadorAuditoria += 1;
  auditoria = [
    ...auditoria,
    {
      id: `negocio-sim-${contadorAuditoria}`,
      entidad,
      entidadId,
      fecha: fechaHoraLocalIso(new Date()),
      usuario: USUARIO_AUDITORIA_SIMULADO,
      accion,
      detalle,
      cambios,
    },
  ];
}

/** The detalle of a sucursal's audit entry always names it: the trail mixes every sucursal. */
function detalleSucursal(sucursal: Pick<Sucursal, 'clave' | 'nombre'>, texto?: string): string {
  return `${sucursal.clave}: ${sucursal.nombre}.${texto ? ` ${texto}` : ''}`;
}

/** The trail as served: fixture entries of a sucursal that don't name it get its clave and nombre. */
function auditoriaConSucursal(): RegistroAuditoria[] {
  return auditoria.map((registro) => {
    if (registro.entidad !== 'sucursal') return registro;
    const sucursal = sucursales.find((s) => s.id === registro.entidadId);
    if (!sucursal || registro.detalle?.startsWith(`${sucursal.clave}:`)) return registro;
    return { ...registro, detalle: detalleSucursal(sucursal, registro.detalle ?? undefined) };
  });
}

/** The sucursal as stored: the localidad's description comes from the CNBV catalog. */
async function datosAFicha(datos: DatosSucursal): Promise<Omit<Sucursal, 'id' | 'estatus'>> {
  const localidad = datos.localidad.trim();
  return {
    clave: datos.clave.trim().toUpperCase(),
    nombre: datos.nombre.trim(),
    responsableId: datos.responsableId.trim() || null,
    calle: datos.calle.trim(),
    numeroExterior: datos.numeroExterior.trim(),
    numeroInterior: datos.numeroInterior.trim() || null,
    colonia: datos.colonia.trim(),
    codigoPostal: datos.codigoPostal.trim(),
    municipio: datos.municipio.trim(),
    entidad: datos.entidad.trim(),
    localidad,
    localidadDescripcion: localidad
      ? descripcionDeLocalidad(await cargarLocalidades(), localidad)
      : '',
    telefono: datos.telefono.trim(),
    horario: datos.horario.trim(),
  };
}

function validarClave(
  solicitud: HttpRequest<unknown>,
  clave: string,
  idPropio: string | null,
): void {
  if (sucursales.some((s) => s.clave === clave && s.id !== idPropio)) {
    rechazar(solicitud, 409, 'CLAVE_SUCURSAL_DUPLICADA', clave);
  }
}

function opciones(): OpcionesNegocio {
  return {
    divisas: DIVISAS.filter((d) => !d.base),
    entidades: ENTIDADES_FEDERATIVAS.map((e) => ({ clave: e.etiqueta, etiqueta: e.etiqueta })),
    sucursales: sucursales
      .filter((s) => s.estatus === 'ACTIVA')
      .map((s) => ({ clave: s.id, etiqueta: s.nombre })),
    usuarios: USUARIOS_PRUEBA.map((u) => ({ clave: u.id, etiqueta: u.nombre })),
    responsables: responsables(),
  };
}

function listarSucursales(solicitud: HttpRequest<unknown>): HttpResponse<unknown> {
  const consulta = consultaDeParametros(parametrosPlanos(solicitud));
  const f = consulta.filtros;
  const filas = [...sucursales]
    .sort((a, b) => a.clave.localeCompare(b.clave))
    .filter(
      (s) =>
        (!f['estatus'] || s.estatus === f['estatus']) &&
        (!f['entidad'] || normalizar(s.entidad).includes(normalizar(f['entidad']))),
    )
    .map(resumen);
  return responderOk(
    solicitud,
    paginar(filas, consulta, {
      clave: (s) => s.clave,
      nombre: (s) => s.nombre,
      codigoPostal: (s) => s.codigoPostal || null,
      usuarios: (s) => s.usuarios,
      operaciones: (s) => s.operaciones,
      estatus: (s) => (s.estatus === 'ACTIVA' ? 0 : 1),
    }),
  );
}

async function guardarNegocio(solicitud: HttpRequest<unknown>): Promise<HttpResponse<unknown>> {
  const { centro: nuevoCentro, legal: nuevoLegal } = solicitud.body as GuardarNegocioDto;
  const matriz = sucursales.find((s) => s.id === nuevoCentro.sucursalMatrizId);
  if (!matriz || matriz.estatus !== 'ACTIVA') rechazar(solicitud, 422, 'MATRIZ_INACTIVA');
  const cambiosCentro = cambiosEntre(centro, nuevoCentro);
  const cambiosLegal = cambiosEntre(legal, nuevoLegal);
  const localidadDescripcion = nuevoCentro.localidad
    ? descripcionDeLocalidad(await cargarLocalidades(), nuevoCentro.localidad)
    : '';
  centro = { ...nuevoCentro, localidadDescripcion, limiteDiarioUsd: centro.limiteDiarioUsd };
  legal = { ...nuevoLegal };
  if (cambiosCentro.length > 0) {
    registrar('negocio', 'centro', 'Datos generales actualizados', null, cambiosCentro);
  }
  if (cambiosLegal.length > 0) {
    registrar('negocio', 'centro', 'Datos legales actualizados', null, cambiosLegal);
  }
  return responderOk(solicitud, perfil());
}

async function crearSucursal(solicitud: HttpRequest<unknown>): Promise<HttpResponse<unknown>> {
  const ficha = await datosAFicha(solicitud.body as DatosSucursal);
  validarClave(solicitud, ficha.clave, null);
  const nueva: Sucursal = {
    ...ficha,
    id: `suc-${String(sucursales.length + 1).padStart(2, '0')}`,
    estatus: 'ACTIVA',
  };
  sucursales = [...sucursales, nueva];
  registrar('sucursal', nueva.id, 'Alta de sucursal', detalleSucursal(nueva), []);
  return responderOk(solicitud, resumen(nueva));
}

async function actualizarSucursal(
  solicitud: HttpRequest<unknown>,
  id: string,
): Promise<HttpResponse<unknown>> {
  const actual = sucursales.find((s) => s.id === id);
  if (!actual) rechazar(solicitud, 404, 'SUCURSAL_NO_ENCONTRADA');
  const ficha = await datosAFicha(solicitud.body as DatosSucursal);
  validarClave(solicitud, ficha.clave, id);
  const actualizada: Sucursal = { ...actual, ...ficha };
  const cambios = cambiosEntre(actual, ficha);
  sucursales = sucursales.map((s) => (s.id === id ? actualizada : s));
  if (cambios.length > 0) {
    registrar('sucursal', id, 'Sucursal corregida', detalleSucursal(actualizada), cambios);
  }
  return responderOk(solicitud, resumen(actualizada));
}

function cambiarEstatus(solicitud: HttpRequest<unknown>, id: string): HttpResponse<unknown> {
  const actual = sucursales.find((s) => s.id === id);
  if (!actual) rechazar(solicitud, 404, 'SUCURSAL_NO_ENCONTRADA');
  const { activa } = solicitud.body as EstatusSucursalDto;
  if (!activa) {
    const usuarios = resumen(actual).usuarios;
    if (usuarios > 0) rechazar(solicitud, 409, 'SUCURSAL_CON_USUARIOS', usuarios);
    const otras = sucursales.filter((s) => s.id !== id && s.estatus === 'ACTIVA');
    if (otras.length === 0) rechazar(solicitud, 409, 'ULTIMA_SUCURSAL_ACTIVA');
    if (centro.sucursalMatrizId === id) rechazar(solicitud, 409, 'MATRIZ_NO_DE_BAJA');
  }
  const actualizada: Sucursal = { ...actual, estatus: activa ? 'ACTIVA' : 'BAJA' };
  sucursales = sucursales.map((s) => (s.id === id ? actualizada : s));
  registrar(
    'sucursal',
    id,
    activa ? 'Sucursal reactivada' : 'Sucursal dada de baja',
    detalleSucursal(
      actual,
      activa ? undefined : 'Cierre de la sucursal; sus operaciones se conservan.',
    ),
    [
      {
        campo: 'Estatus',
        antes: activa ? 'Baja' : 'Activa',
        despues: activa ? 'Activa' : 'Baja',
      },
    ],
  );
  return responderOk(solicitud, resumen(actualizada));
}

/**
 * Simulated backend of `negocio`: the centro's profile and legal data, its sucursales (paged list,
 * alta, corrección, baja and reactivación with the demo's rules) and the audit trail, which grows
 * with each change.
 */
export const manejadorNegocio: ManejadorApi = {
  responder(solicitud: HttpRequest<unknown>): RespuestaSimulada | null {
    const { method, url } = solicitud;

    if (url === RUTAS_NEGOCIO.centro) {
      if (method === 'GET') return responderOk(solicitud, perfil());
      if (method === 'PUT') return guardarNegocio(solicitud);
      return null;
    }
    if (method === 'GET' && url === RUTAS_NEGOCIO.opciones) {
      return responderOk(solicitud, opciones());
    }
    if (method === 'GET' && url === RUTAS_NEGOCIO.auditoria) {
      return responderOk(solicitud, auditoriaConSucursal());
    }
    if (url === RUTAS_NEGOCIO.sucursales) {
      if (method === 'GET') return listarSucursales(solicitud);
      if (method === 'POST') return crearSucursal(solicitud);
      return null;
    }
    if (!url.startsWith(RUTAS_NEGOCIO.sucursal)) return null;

    if (method === 'PUT' && url.endsWith(SUFIJO_ESTATUS_SUCURSAL)) {
      const id = url.slice(RUTAS_NEGOCIO.sucursal.length, -SUFIJO_ESTATUS_SUCURSAL.length);
      return id && !id.includes('/') ? cambiarEstatus(solicitud, decodeURIComponent(id)) : null;
    }
    const id = idDeRuta(solicitud, RUTAS_NEGOCIO.sucursal);
    if (!id) return null;
    if (method === 'GET') {
      const sucursal = sucursales.find((s) => s.id === id);
      if (!sucursal) return rechazar(solicitud, 404, 'SUCURSAL_NO_ENCONTRADA');
      return responderOk(solicitud, resumen(sucursal));
    }
    if (method === 'PUT') return actualizarSucursal(solicitud, id);
    return null;
  },
};

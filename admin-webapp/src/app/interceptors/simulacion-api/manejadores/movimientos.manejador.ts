import { HttpRequest, HttpResponse } from '@angular/common/http';
import {
  ENCABEZADOS_EXPORTACION_MOVIMIENTOS,
  ETIQUETA_CLASE_MOVIMIENTO,
  PILL_ESTATUS_MOVIMIENTO,
  RUTAS_MOVIMIENTOS,
} from '@data/constants/movimientos.constants';
import { ConsultaListaDto } from '@data/dto/lista.dto';
import {
  AprobacionDotacionDto,
  MovimientoDetalleDto,
  MovimientoListaDto,
  RechazoDotacionDto,
} from '@data/dto/movimientos.dto';
import { CAJAS } from '@data/fixtures/cajas.fixture';
import { DIVISAS } from '@data/fixtures/divisas.fixture';
import { CAJEROS } from '@data/fixtures/cajeros.fixture';
import { BANCOS_MOVIMIENTOS, MOVIMIENTOS } from '@data/fixtures/movimientos.fixture';
import { SUCURSALES } from '@data/fixtures/negocio.fixture';
import { USUARIOS_PRUEBA } from '@data/fixtures/usuarios.fixture';
import { CambioAuditoria } from '@data/interfaces/cambio-auditoria';
import { ManejadorApi } from '@data/interfaces/manejador-api';
import { MontoMovimiento } from '@data/interfaces/monto-movimiento';
import { Movimiento } from '@data/interfaces/movimiento';
import { RegistroAuditoria } from '@data/interfaces/registro-auditoria';
import { PasoSeguimientoMovimiento } from '@data/interfaces/paso-seguimiento-movimiento';
import { TipoExtremoMovimiento } from '@data/types/movimiento.types';
import { parametrosPlanos, rechazar, responderOk } from '@interceptors/simulacion-api/respuestas';
import { formatearMonto, redondear } from '@utils/dinero/formato-dinero';
import { fechaHoraLocalIso } from '@utils/fechas/fechas';
import { consultaDeParametros, paginar } from '@utils/lista/consulta-lista';

/** The server's memory: a reload re-seeds it from the fixture (plans/02: nothing persists outside NGXS). */
const registros: Movimiento[] = MOVIMIENTOS.map((m) => ({ ...m }));

const ORDEN_DIVISAS: string[] = DIVISAS.map((d) => d.clave);

/** The name of a cajero or of a superadmin; null when there is none. */
function nombreDePersona(id: string | null): string | null {
  if (!id) return null;
  return (
    CAJEROS.find((c) => c.id === id)?.nombreCompleto ??
    USUARIOS_PRUEBA.find((u) => u.id === id)?.nombre ??
    null
  );
}

/** The amounts a reviewer changed on approval, as `antes → después` per currency. */
function cambiosDeCorreccion(movimiento: Movimiento): CambioAuditoria[] {
  return movimiento.montosSolicitados.flatMap((pedido) => {
    const autorizado = movimiento.montos.find((m) => m.divisa === pedido.divisa)?.monto ?? 0;
    return autorizado === pedido.monto
      ? []
      : [
          {
            campo: `Monto en ${pedido.divisa}`,
            antes: formatearMonto(pedido.monto, pedido.divisa),
            despues: formatearMonto(autorizado, pedido.divisa),
          },
        ];
  });
}

/**
 * The audit trail of a movement, derived from its record: the send or request, and its
 * resolution. A correction on approval shows each changed amount as `antes → después`.
 */
function auditoriaDeMovimiento(movimiento: Movimiento): RegistroAuditoria[] {
  const registros: RegistroAuditoria[] = [
    {
      id: `${movimiento.id}-registro`,
      entidad: 'movimiento',
      entidadId: movimiento.id,
      fecha: movimiento.fecha,
      usuario: nombreDePersona(movimiento.solicitadoPorId) ?? 'Sistema',
      accion:
        movimiento.clase === 'DOTACION'
          ? 'Solicitud de dotación'
          : movimiento.clase === 'TRASLADO_VALORES'
            ? 'Traslado de valores registrado'
            : 'Traspaso enviado',
      detalle: movimiento.observaciones,
      cambios: [],
    },
  ];
  if (!movimiento.resueltoEn) return registros;

  const usuario = nombreDePersona(movimiento.resueltoPorId) ?? 'Sistema';
  const base = {
    id: `${movimiento.id}-resolucion`,
    entidad: 'movimiento' as const,
    entidadId: movimiento.id,
    fecha: movimiento.resueltoEn,
    usuario,
  };
  switch (movimiento.estatus) {
    case 'RECIBIDO':
      registros.push({ ...base, accion: 'Recepción confirmada', detalle: null, cambios: [] });
      break;
    case 'CANCELADO':
      registros.push({
        ...base,
        accion: 'Cancelación',
        detalle: movimiento.notaResolucion,
        cambios: [],
      });
      break;
    case 'RECHAZADA':
      registros.push({
        ...base,
        accion: 'Dotación rechazada',
        detalle: movimiento.notaResolucion,
        cambios: [],
      });
      break;
    case 'APROBADA': {
      const cambios = cambiosDeCorreccion(movimiento);
      registros.push({
        ...base,
        accion: cambios.length > 0 ? 'Dotación corregida y aprobada' : 'Dotación aprobada',
        detalle: movimiento.notaResolucion,
        cambios,
      });
      break;
    }
    default:
      break;
  }
  return registros;
}

const nombreSucursal = (id: string | null): string =>
  SUCURSALES.find((s) => s.id === id)?.nombre ?? '';

/** The name of one end of a movement and the line under it. */
function describirExtremo(tipo: TipoExtremoMovimiento, id: string): [string, string] {
  switch (tipo) {
    case 'CAJA': {
      const caja = CAJAS.find((c) => c.id === id);
      return [caja?.nombre ?? '', nombreSucursal(caja?.sucursalId ?? null)];
    }
    case 'SUCURSAL':
      return [nombreSucursal(id), 'Sucursal'];
    case 'BANCO':
      return [BANCOS_MOVIMIENTOS.find((b) => b.id === id)?.nombre ?? '', 'Banco'];
  }
}

/** The sucursal an end belongs to; null for a bank. */
function sucursalDeExtremo(tipo: TipoExtremoMovimiento, id: string): string | null {
  if (tipo === 'CAJA') return CAJAS.find((c) => c.id === id)?.sucursalId ?? null;
  return tipo === 'SUCURSAL' ? id : null;
}

function aDto(movimiento: Movimiento): MovimientoListaDto {
  const [origen, origenDetalle] = describirExtremo(movimiento.origenTipo, movimiento.origenId);
  const [destino, destinoDetalle] = describirExtremo(movimiento.destinoTipo, movimiento.destinoId);
  return {
    ...movimiento,
    origen,
    origenDetalle,
    destino,
    destinoDetalle,
    solicitadoPor: nombreDePersona(movimiento.solicitadoPorId) ?? '',
    resueltoPor: nombreDePersona(movimiento.resueltoPorId),
  };
}

function seguimientoDe(movimiento: Movimiento): PasoSeguimientoMovimiento[] {
  const solicitante = nombreDePersona(movimiento.solicitadoPorId);
  const resolvio = nombreDePersona(movimiento.resueltoPorId);
  const cambios = cambiosDeCorreccion(movimiento);
  const corregida = cambios.length > 0;
  if (movimiento.clase === 'DOTACION') {
    const pasos: PasoSeguimientoMovimiento[] = [
      {
        etiqueta: 'Solicitada',
        estado: 'hecho',
        fecha: movimiento.fecha,
        usuario: solicitante,
        nota: movimiento.observaciones,
      },
    ];
    switch (movimiento.estatus) {
      case 'APROBADA':
        pasos.push({
          etiqueta: corregida ? 'Corregida y aprobada' : 'Aprobada',
          estado: 'hecho',
          fecha: movimiento.resueltoEn,
          usuario: resolvio,
          nota: movimiento.notaResolucion,
          cambios,
        });
        break;
      case 'RECHAZADA':
        pasos.push({
          etiqueta: 'Rechazada',
          estado: 'negativo',
          fecha: movimiento.resueltoEn,
          usuario: resolvio,
          nota: movimiento.notaResolucion,
        });
        break;
      default:
        pasos.push({
          etiqueta: 'Revisión de un superadministrador',
          estado: 'pendiente',
          fecha: null,
          usuario: null,
          nota: null,
        });
    }
    return pasos;
  }
  const pasos: PasoSeguimientoMovimiento[] = [
    {
      etiqueta: 'Enviado',
      estado: 'hecho',
      fecha: movimiento.fecha,
      usuario: solicitante,
      nota: movimiento.observaciones,
    },
  ];
  const traslado = movimiento.traslado;
  if (traslado?.recoleccionEn) {
    pasos.push({
      etiqueta: 'Recolectado',
      estado: 'hecho',
      fecha: traslado.recoleccionEn,
      usuario: null,
      nota: `${traslado.empresaTransporte} · Marchamo ${traslado.marchamo}`,
    });
  }
  if (traslado?.entregaEn) {
    pasos.push({
      etiqueta: 'Entregado',
      estado: 'hecho',
      fecha: traslado.entregaEn,
      usuario: null,
      nota: null,
    });
  }
  switch (movimiento.estatus) {
    case 'RECIBIDO':
      pasos.push({
        etiqueta: 'Recibido',
        estado: 'hecho',
        fecha: movimiento.resueltoEn,
        usuario: resolvio,
        nota: null,
      });
      break;
    case 'CANCELADO':
      pasos.push({
        etiqueta: 'Cancelado',
        estado: 'negativo',
        fecha: movimiento.resueltoEn,
        usuario: resolvio,
        nota: movimiento.notaResolucion,
      });
      break;
    default:
      pasos.push({
        etiqueta: 'Por recibir',
        estado: 'pendiente',
        fecha: null,
        usuario: null,
        nota: null,
      });
  }
  return pasos;
}

function detalleDe(movimiento: Movimiento): MovimientoDetalleDto {
  return {
    movimiento: aDto(movimiento),
    seguimiento: seguimientoDe(movimiento),
    auditoria: auditoriaDeMovimiento(movimiento),
    decimales: Object.fromEntries(DIVISAS.map((d) => [d.clave, d.decimales])),
  };
}

/** The movements behind the filters of a list request. */
function filtrar(consulta: ConsultaListaDto): MovimientoListaDto[] {
  const f = consulta.filtros;
  return registros
    .filter(
      (m) =>
        (f['vista'] !== 'traspasos' || m.clase === 'TRASPASO') &&
        (f['vista'] !== 'traslados' || m.clase === 'TRASLADO_VALORES') &&
        (f['vista'] !== 'dotaciones' || m.clase === 'DOTACION') &&
        (f['vista'] !== 'por-aprobar' || m.estatus === 'PENDIENTE_APROBACION') &&
        (!f['desde'] || m.fecha.slice(0, 10) >= f['desde']) &&
        (!f['hasta'] || m.fecha.slice(0, 10) <= f['hasta']) &&
        (!f['sucursal'] ||
          sucursalDeExtremo(m.origenTipo, m.origenId) === f['sucursal'] ||
          sucursalDeExtremo(m.destinoTipo, m.destinoId) === f['sucursal']) &&
        (!f['divisa'] || m.montos.some((monto) => monto.divisa === f['divisa'])) &&
        (!f['estatus'] || m.estatus === f['estatus']) &&
        (!f['folio'] || m.folio.includes(f['folio'].toUpperCase())),
    )
    .map(aDto);
}

function ordenar(consulta: ConsultaListaDto): ConsultaListaDto {
  return consulta.orden ? consulta : { ...consulta, orden: 'fecha', direccion: 'desc' };
}

const ORDENADORES = {
  folio: (m: MovimientoListaDto) => m.folio,
  fecha: (m: MovimientoListaDto) => m.fecha,
  clase: (m: MovimientoListaDto) => ETIQUETA_CLASE_MOVIMIENTO[m.clase],
  estatus: (m: MovimientoListaDto) => PILL_ESTATUS_MOVIMIENTO[m.estatus].etiqueta,
};

/** What moved in each currency (only the filtered one when there is a divisa filter); cancelled and declined movements don't count. */
function totalizar(
  filas: readonly MovimientoListaDto[],
  divisaFiltrada: string | undefined,
): MontoMovimiento[] {
  const totales = new Map<string, number>();
  for (const fila of filas) {
    if (fila.estatus === 'CANCELADO' || fila.estatus === 'RECHAZADA') continue;
    for (const { divisa, monto } of fila.montos) {
      if (divisaFiltrada && divisa !== divisaFiltrada) continue;
      totales.set(divisa, (totales.get(divisa) ?? 0) + monto);
    }
  }
  return [...totales.entries()]
    .sort(([a], [b]) => ORDEN_DIVISAS.indexOf(a) - ORDEN_DIVISAS.indexOf(b))
    .map(([divisa, monto]) => ({
      divisa: divisa as MontoMovimiento['divisa'],
      monto: redondear(monto),
    }));
}

const celdaCsv = (valor: string | number | null): string =>
  `"${String(valor ?? '').replaceAll('"', '""')}"`;

/** The filtered list as CSV, one line per movement and currency; a UTF-8 mark makes Excel read the accents. */
function exportar(consulta: ConsultaListaDto): Blob {
  const filas = filtrar(consulta);
  const todas = paginar(
    filas,
    { ...ordenar(consulta), pagina: 1, limite: Math.max(1, filas.length) },
    ORDENADORES,
  );
  const lineas = todas.filas.flatMap((m) =>
    m.montos.map((monto) =>
      [
        m.folio,
        ETIQUETA_CLASE_MOVIMIENTO[m.clase],
        PILL_ESTATUS_MOVIMIENTO[m.estatus].etiqueta,
        m.fecha.replace('T', ' ').slice(0, 16),
        `${m.origen} (${m.origenDetalle})`,
        `${m.destino} (${m.destinoDetalle})`,
        monto.divisa,
        monto.monto,
        m.solicitadoPor,
        m.resueltoPor,
        m.observaciones,
        m.notaResolucion,
      ]
        .map(celdaCsv)
        .join(','),
    ),
  );
  const encabezado = ENCABEZADOS_EXPORTACION_MOVIMIENTOS.map(celdaCsv).join(',');
  return new Blob(['﻿', [encabezado, ...lineas].join('\r\n')], {
    type: 'text/csv;charset=utf-8',
  });
}

/** `…/movimientos/:id/:accion` → `[id, accion]`; null when the URL isn't one. */
function idYAccion(solicitud: HttpRequest<unknown>): [string, string] | null {
  if (!solicitud.url.startsWith(RUTAS_MOVIMIENTOS.detalle)) return null;
  const partes = solicitud.url.slice(RUTAS_MOVIMIENTOS.detalle.length).split('/');
  return partes.length === 2 && partes[0] && partes[1]
    ? [decodeURIComponent(partes[0]), partes[1]]
    : null;
}

/** A pending dotación, or a refusal; also checks that the reviewer is a superadmin. */
function dotacionPorRevisar(
  solicitud: HttpRequest<unknown>,
  id: string,
  usuarioId: string,
): Movimiento {
  const usuario = USUARIOS_PRUEBA.find((u) => u.id === usuarioId);
  if (usuario?.rol !== 'SUPERADMIN') rechazar(solicitud, 403, 'SIN_PERMISO');
  const movimiento = registros.find((m) => m.id === id);
  if (!movimiento) rechazar(solicitud, 404, 'MOVIMIENTO_NO_ENCONTRADO');
  if (movimiento.clase !== 'DOTACION' || movimiento.estatus !== 'PENDIENTE_APROBACION') {
    rechazar(solicitud, 409, 'MOVIMIENTO_NO_PENDIENTE');
  }
  return movimiento;
}

function aprobar(solicitud: HttpRequest<unknown>, id: string): HttpResponse<unknown> {
  const { usuarioId, montos, comentario } = solicitud.body as AprobacionDotacionDto;
  const movimiento = dotacionPorRevisar(solicitud, id, usuarioId);
  const permitidas = movimiento.montosSolicitados.map((m) => m.divisa);
  const decimalesDe = (divisa: string): number =>
    DIVISAS.find((d) => d.clave === divisa)?.decimales ?? 2;
  const excedeDecimales = montos.some(
    (m) => Number.isFinite(m.monto) && redondear(m.monto, decimalesDe(m.divisa)) !== m.monto,
  );
  const validos = montos.filter(
    (m) => permitidas.includes(m.divisa) && Number.isFinite(m.monto) && m.monto > 0,
  );
  if (
    validos.length === 0 ||
    excedeDecimales ||
    montos.some((m) => !permitidas.includes(m.divisa) || !Number.isFinite(m.monto) || m.monto < 0)
  ) {
    rechazar(solicitud, 400, 'MONTOS_INVALIDOS');
  }
  movimiento.montos = validos.map((m) => ({ divisa: m.divisa, monto: m.monto }));
  movimiento.estatus = 'APROBADA';
  movimiento.resueltoPorId = usuarioId;
  movimiento.resueltoEn = fechaHoraLocalIso(new Date());
  movimiento.notaResolucion = comentario?.trim() || null;
  return responderOk(solicitud, detalleDe(movimiento));
}

function rechazarDotacion(solicitud: HttpRequest<unknown>, id: string): HttpResponse<unknown> {
  const { usuarioId, motivo } = solicitud.body as RechazoDotacionDto;
  const movimiento = dotacionPorRevisar(solicitud, id, usuarioId);
  if (!motivo?.trim()) rechazar(solicitud, 400, 'MOTIVO_REQUERIDO');
  movimiento.estatus = 'RECHAZADA';
  movimiento.resueltoPorId = usuarioId;
  movimiento.resueltoEn = fechaHoraLocalIso(new Date());
  movimiento.notaResolucion = motivo.trim();
  return responderOk(solicitud, detalleDe(movimiento));
}

/**
 * Simulated backend of `movimientos`: the list with its totals and filters, the export, one
 * movement with its status trail and audit, and the review of dotaciones (approve, optionally
 * correcting the amounts; decline with a motive). Reviewing changes the in-memory records.
 */
export const manejadorMovimientos: ManejadorApi = {
  responder(solicitud: HttpRequest<unknown>): HttpResponse<unknown> | null {
    if (solicitud.method === 'GET') {
      if (solicitud.url === RUTAS_MOVIMIENTOS.lista) {
        const consulta = consultaDeParametros(parametrosPlanos(solicitud));
        const filas = filtrar(consulta);
        return responderOk(solicitud, {
          ...paginar(filas, ordenar(consulta), ORDENADORES),
          totales: totalizar(filas, consulta.filtros['divisa']),
        });
      }
      if (solicitud.url === RUTAS_MOVIMIENTOS.exportacion) {
        return responderOk(solicitud, exportar(consultaDeParametros(parametrosPlanos(solicitud))));
      }
      if (solicitud.url.startsWith(RUTAS_MOVIMIENTOS.detalle)) {
        const id = decodeURIComponent(solicitud.url.slice(RUTAS_MOVIMIENTOS.detalle.length));
        const movimiento = id && !id.includes('/') ? registros.find((m) => m.id === id) : null;
        if (!movimiento) rechazar(solicitud, 404, 'MOVIMIENTO_NO_ENCONTRADO');
        return responderOk(solicitud, detalleDe(movimiento));
      }
      return null;
    }
    if (solicitud.method === 'POST') {
      const ruta = idYAccion(solicitud);
      if (ruta?.[1] === RUTAS_MOVIMIENTOS.aprobacion) return aprobar(solicitud, ruta[0]);
      if (ruta?.[1] === RUTAS_MOVIMIENTOS.rechazo) return rechazarDotacion(solicitud, ruta[0]);
    }
    return null;
  },
};

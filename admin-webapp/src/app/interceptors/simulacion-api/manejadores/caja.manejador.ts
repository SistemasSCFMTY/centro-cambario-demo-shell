import { HttpRequest, HttpResponse } from '@angular/common/http';
import { CUADRA_CAJA, RUTAS_CAJA } from '@data/constants/caja.constants';
import {
  CajaFilaDto,
  CajasPaginaDto,
  ConteoFilaDto,
  ConteosPaginaDto,
  DiferenciaDivisaDto,
  TotalDivisaDto,
} from '@data/dto/caja-pagina.dto';
import { CAJAS, EXISTENCIAS_CAJA } from '@data/fixtures/cajas.fixture';
import { CAJEROS } from '@data/fixtures/cajeros.fixture';
import { CONTEOS_CAJA } from '@data/fixtures/conteos-caja.fixture';
import { DIVISAS } from '@data/fixtures/divisas.fixture';
import { SUCURSALES } from '@data/fixtures/negocio.fixture';
import { USUARIOS_PRUEBA } from '@data/fixtures/usuarios.fixture';
import { ManejadorApi } from '@data/interfaces/manejador-api';
import { OpcionFiltro } from '@data/interfaces/opcion-filtro';
import { EstatusCaja } from '@data/types/caja.types';
import { CodigoDivisa } from '@data/types/divisa.types';
import { parametrosPlanos, responderOk } from '@interceptors/simulacion-api/respuestas';
import { redondear } from '@utils/dinero/formato-dinero';
import { consultaDeParametros, paginar } from '@utils/lista/consulta-lista';

const decimalesDe = (divisa: CodigoDivisa): number =>
  DIVISAS.find((d) => d.clave === divisa)?.decimales ?? 2;

const nombreSucursal = (id: string): string => SUCURSALES.find((s) => s.id === id)?.nombre ?? '';

const nombreCajero = (id: string): string => CAJEROS.find((c) => c.id === id)?.nombreCompleto ?? '';

/** Who counted: a cajero, or a usuario of supervisión for an arqueo. */
function nombreRealizo(id: string): string {
  const usuario = USUARIOS_PRUEBA.find((u) => u.id === id);
  return usuario ? `${usuario.nombre} ${usuario.apellidos}`.trim() : nombreCajero(id);
}

function estatusDe(activa: boolean, abiertaEn: string | null): EstatusCaja {
  if (!activa) return 'INACTIVA';
  return abiertaEn ? 'ABIERTA' : 'CERRADA';
}

function filasCaja(): CajaFilaDto[] {
  return CAJAS.map((caja) => {
    const saldos = Object.fromEntries(
      DIVISAS.map((d) => [
        d.clave,
        EXISTENCIAS_CAJA.find((e) => e.cajaId === caja.id && e.divisa === d.clave)?.saldo ?? 0,
      ]),
    ) as Record<CodigoDivisa, number>;
    return {
      ...caja,
      sucursal: nombreSucursal(caja.sucursalId),
      responsable: caja.responsableId ? nombreCajero(caja.responsableId) : null,
      estatus: estatusDe(caja.activa, caja.abiertaEn),
      saldos,
    };
  });
}

function responderCajas(solicitud: HttpRequest<unknown>): HttpResponse<CajasPaginaDto> {
  const consulta = consultaDeParametros(parametrosPlanos(solicitud));
  const f = consulta.filtros;
  const filas = filasCaja().filter(
    (c) =>
      (!f['sucursal'] || c.sucursalId === f['sucursal']) &&
      (!f['tipo'] || c.tipo === f['tipo']) &&
      (!f['estatus'] || c.estatus === f['estatus']),
  );
  const totales: TotalDivisaDto[] = DIVISAS.map((d) => ({
    divisa: d.clave,
    decimales: d.decimales,
    saldo: redondear(filas.reduce((suma, c) => suma + c.saldos[d.clave], 0)),
  }));
  const ordenadores: Record<string, (c: CajaFilaDto) => string | number | null> = {
    caja: (c) => `${c.sucursal} ${c.tipo === 'BOVEDA' ? 0 : 1} ${c.nombre}`,
    estatus: (c) => c.estatus,
  };
  for (const d of DIVISAS) ordenadores[d.clave] = (c) => c.saldos[d.clave];
  const consultaOrdenada = consulta.orden
    ? consulta
    : { ...consulta, orden: 'caja', direccion: 'asc' as const };
  return responderOk(solicitud, { ...paginar(filas, consultaOrdenada, ordenadores), totales });
}

function filasConteo(): ConteoFilaDto[] {
  return CONTEOS_CAJA.map((conteo) => {
    const caja = CAJAS.find((c) => c.id === conteo.cajaId);
    return {
      id: conteo.id,
      cajaId: conteo.cajaId,
      tipoCaja: caja?.tipo ?? 'CAJA',
      tipo: conteo.tipo,
      realizadoEn: conteo.realizadoEn,
      caja: caja?.nombre ?? '',
      sucursal: caja ? nombreSucursal(caja.sucursalId) : '',
      responsable: nombreCajero(conteo.responsableId),
      realizo: nombreRealizo(conteo.realizadoPorId),
      observaciones: conteo.observaciones,
      detalle: conteo.detalle
        .filter((d) => d.contado || d.sistema || Math.abs(d.diferencia) >= CUADRA_CAJA)
        .map((d) => ({
          ...d,
          diferencia: Math.abs(d.diferencia) >= CUADRA_CAJA ? d.diferencia : 0,
          decimales: decimalesDe(d.divisa),
        })),
    };
  });
}

function responderConteos(solicitud: HttpRequest<unknown>): HttpResponse<ConteosPaginaDto> {
  const consulta = consultaDeParametros(parametrosPlanos(solicitud));
  const f = consulta.filtros;
  const filas = filasConteo().filter(
    (k) =>
      (!f['caja'] || k.cajaId === f['caja']) &&
      (!f['tipo'] || k.tipo === f['tipo']) &&
      (f['diferencias'] !== '1' || k.detalle.some((d) => d.diferencia !== 0)),
  );

  const acumulado = new Map<CodigoDivisa, DiferenciaDivisaDto>();
  for (const conteo of filas.filter((k) => k.tipo !== 'ARQUEO')) {
    for (const d of conteo.detalle.filter((x) => x.diferencia !== 0)) {
      const actual = acumulado.get(d.divisa) ?? {
        divisa: d.divisa,
        decimales: d.decimales,
        sobrante: 0,
        faltante: 0,
      };
      if (d.diferencia > 0) actual.sobrante = redondear(actual.sobrante + d.diferencia);
      else actual.faltante = redondear(actual.faltante - d.diferencia);
      acumulado.set(d.divisa, actual);
    }
  }

  const consultaOrdenada = consulta.orden
    ? consulta
    : { ...consulta, orden: 'fecha', direccion: 'desc' as const };
  const pagina = paginar(filas, consultaOrdenada, {
    fecha: (k) => k.realizadoEn,
    tipo: (k) => k.tipo,
    caja: (k) => `${k.sucursal} ${k.caja}`,
  });
  return responderOk(solicitud, { ...pagina, diferencias: [...acumulado.values()] });
}

/** The drawers the conteos filter offers: names repeat across sucursales, so each carries its own. */
function responderOpciones(solicitud: HttpRequest<unknown>): HttpResponse<OpcionFiltro[]> {
  const opciones = CAJAS.filter((c) => c.tipo === 'CAJA').map((c) => ({
    valor: c.id,
    etiqueta: `${c.nombre} · ${nombreSucursal(c.sucursalId)}`,
  }));
  return responderOk(solicitud, opciones);
}

/**
 * Simulated backend of `caja` (read-only): the cajas and bóvedas with their balances, and the
 * conteos history (apertura, arqueo, corte) with its sobrantes and faltantes.
 */
export const manejadorCaja: ManejadorApi = {
  responder(solicitud: HttpRequest<unknown>): HttpResponse<unknown> | null {
    if (solicitud.method !== 'GET') return null;
    if (solicitud.url === RUTAS_CAJA.lista) return responderCajas(solicitud);
    if (solicitud.url === RUTAS_CAJA.conteos) return responderConteos(solicitud);
    if (solicitud.url === RUTAS_CAJA.opciones) return responderOpciones(solicitud);
    return null;
  },
};

import { HttpRequest, HttpResponse } from '@angular/common/http';
import { RUTAS_OPERACIONES } from '@data/constants/operaciones.constants';
import { OperacionDetalleDto, OperacionListaDto } from '@data/dto/operaciones.dto';
import { CAJAS } from '@data/fixtures/cajas.fixture';
import { CAJEROS } from '@data/fixtures/cajeros.fixture';
import { CLIENTES } from '@data/fixtures/clientes.fixture';
import { AUDITORIA } from '@data/fixtures/auditoria.fixture';
import { SUCURSALES } from '@data/fixtures/negocio.fixture';
import { USUARIOS_PRUEBA } from '@data/fixtures/usuarios.fixture';
import { OPERACIONES } from '@data/fixtures/operaciones.fixture';
import { ManejadorApi } from '@data/interfaces/manejador-api';
import {
  idDeRuta,
  parametrosPlanos,
  rechazar,
  responderOk,
} from '@interceptors/simulacion-api/respuestas';
import { hoyIso } from '@utils/fechas/fechas';
import { consultaDeParametros, paginar } from '@utils/lista/consulta-lista';
import { normalizar } from '@utils/texto/normalizar';

function listar(): OperacionListaDto[] {
  return OPERACIONES.map((operacion) => {
    const cliente = CLIENTES.find((c) => c.id === operacion.clienteId) ?? null;
    return {
      ...operacion,
      sucursal: SUCURSALES.find((s) => s.id === operacion.sucursalId)?.nombre ?? '',
      caja: CAJAS.find((c) => c.id === operacion.cajaId)?.nombre ?? '',
      cajero: CAJEROS.find((c) => c.id === operacion.cajeroId)?.nombreCompleto ?? '',
      cliente: cliente?.nombreCompleto ?? operacion.nombreOcasional,
      numeroCliente: cliente?.numeroCliente ?? null,
      autorizadoPor:
        USUARIOS_PRUEBA.find((u) => u.id === operacion.autorizadoPorId)?.nombre ?? null,
    };
  });
}

/**
 * Simulated backend of `operaciones` (read-only): filters like a server (`vista`, `desde`, `hasta`,
 * `sucursal`, `cajero`, `divisa`, `tipo`, `instrumento`, `estatus`, `folio`, `cliente`, `usdMin`,
 * `usdMax`; the last six are the demo's búsqueda avanzada) and pages through `paginar`.
 */
export const manejadorOperaciones: ManejadorApi = {
  responder(solicitud: HttpRequest<unknown>): HttpResponse<unknown> | null {
    if (solicitud.method !== 'GET') return null;

    if (solicitud.url === RUTAS_OPERACIONES.lista) {
      const consulta = consultaDeParametros(parametrosPlanos(solicitud));
      const f = consulta.filtros;
      const hoy = hoyIso();
      if (f['desde'] && f['hasta'] && f['desde'] > f['hasta'])
        return rechazar(solicitud, 400, 'RANGO_FECHAS_INVALIDO');
      const hayRango = !!(f['desde'] || f['hasta']);
      const filas = listar().filter(
        (o) =>
          (f['vista'] !== 'hoy' || hayRango || o.fechaOperacion.startsWith(hoy)) &&
          (f['vista'] !== 'pendientes' || o.estatus === 'PENDIENTE_AUTORIZACION') &&
          (!f['desde'] || o.fechaOperacion.slice(0, 10) >= f['desde']) &&
          (!f['hasta'] || o.fechaOperacion.slice(0, 10) <= f['hasta']) &&
          (!f['sucursal'] || o.sucursalId === f['sucursal']) &&
          (!f['cajero'] || o.cajeroId === f['cajero']) &&
          (!f['divisa'] || o.divisa === f['divisa']) &&
          (!f['tipo'] || o.tipo === f['tipo']) &&
          (!f['instrumento'] || o.instrumento === f['instrumento']) &&
          (!f['estatus'] || o.estatus === f['estatus']) &&
          (!f['usdMin'] || o.montoUsd >= Number(f['usdMin'])) &&
          (!f['usdMax'] || o.montoUsd <= Number(f['usdMax'])) &&
          (!f['folio'] || o.folio.includes(f['folio'].toUpperCase())) &&
          (!f['cliente'] ||
            normalizar(`${o.cliente ?? ''} ${o.numeroCliente ?? ''}`).includes(
              normalizar(f['cliente']),
            )),
      );
      const ordenada = consulta.orden
        ? consulta
        : { ...consulta, orden: 'fechaOperacion', direccion: 'desc' as const };
      return responderOk(
        solicitud,
        paginar(filas, ordenada, {
          fechaOperacion: (o) => o.fechaOperacion,
          folio: (o) => o.folio,
          sucursal: (o) => o.sucursal,
          tipo: (o) => o.tipo,
          divisa: (o) => o.divisa,
          montoDivisa: (o) => o.montoDivisa,
          tipoCambio: (o) => o.tipoCambio,
          montoMxn: (o) => o.montoMxn,
          montoUsd: (o) => o.montoUsd,
          estatus: (o) => o.estatus,
        }),
      );
    }

    const id = idDeRuta(solicitud, RUTAS_OPERACIONES.detalle);
    if (id) {
      const operacion = listar().find((o) => o.id === id);
      if (!operacion) return rechazar(solicitud, 404, 'OPERACION_NO_ENCONTRADA');
      const detalle: OperacionDetalleDto = {
        operacion,
        auditoria: AUDITORIA.filter((a) => a.entidad === 'operacion' && a.entidadId === id),
      };
      return responderOk(solicitud, detalle);
    }
    return null;
  },
};

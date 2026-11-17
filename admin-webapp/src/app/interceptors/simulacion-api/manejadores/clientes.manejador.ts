import { HttpRequest, HttpResponse } from '@angular/common/http';
import { OPERACIONES_RECIENTES, RUTAS_CLIENTES } from '@data/constants/clientes.constants';
import { REGLAS_OPERACION } from '@data/constants/reglas-operacion.constants';
import { ClienteOperacionesDto } from '@data/dto/clientes-operaciones.dto';
import { ClienteDetalleDto } from '@data/dto/clientes.dto';
import { AUDITORIA } from '@data/fixtures/auditoria.fixture';
import { CLIENTES } from '@data/fixtures/clientes.fixture';
import { OPERACIONES } from '@data/fixtures/operaciones.fixture';
import { ClienteDetalle } from '@data/interfaces/cliente-detalle';
import { ClienteResumen } from '@data/interfaces/cliente-resumen';
import { ManejadorApi } from '@data/interfaces/manejador-api';
import { MovimientoCliente } from '@data/interfaces/movimiento-cliente';
import { Operacion } from '@data/interfaces/operacion';
import {
  idDeRuta,
  parametrosPlanos,
  rechazar,
  responderOk,
} from '@interceptors/simulacion-api/respuestas';
import { hoyIso } from '@utils/fechas/fechas';
import { redondear } from '@utils/dinero/formato-dinero';
import { consultaDeParametros, paginar } from '@utils/lista/consulta-lista';
import { normalizar } from '@utils/texto/normalizar';

function aResumen(cliente: ClienteDetalle): ClienteResumen {
  return {
    id: cliente.id,
    numeroCliente: cliente.numeroCliente,
    tipoPersona: cliente.tipoPersona,
    nombreCompleto: cliente.nombreCompleto,
    fechaBase: cliente.fechaBase,
    curp: cliente.curp,
    rfc: cliente.rfc,
    nivelExpediente: cliente.nivelExpediente,
    gradoRiesgo: cliente.gradoRiesgo,
    esPep: cliente.esPep,
    tipoPep: cliente.tipoPep,
    estatus: cliente.estatus,
    fechaAlta: cliente.fechaAlta,
  };
}

function operacionesDe(clienteId: string): ClienteOperacionesDto {
  const propias = OPERACIONES.filter((o) => o.clienteId === clienteId).sort((a, b) =>
    b.fechaOperacion.localeCompare(a.fechaOperacion),
  );
  const hoy = hoyIso();
  const mes = hoy.slice(0, 7);
  const completadas = propias.filter((o) => o.estatus === 'COMPLETADA');
  const delMes = completadas.filter((o) => o.fechaOperacion.startsWith(mes));
  const deHoy = propias.filter(
    (o) =>
      o.fechaOperacion.startsWith(hoy) &&
      (o.estatus === 'COMPLETADA' || o.estatus === 'PENDIENTE_AUTORIZACION'),
  );
  const sumaUsd = (filas: readonly Operacion[]) =>
    redondear(filas.reduce((total, o) => total + o.montoUsd, 0));
  const movimientos: MovimientoCliente[] = completadas.flatMap((o) => {
    const compra = o.tipo === 'COMPRA';
    const base = { operacionId: o.id, folio: o.folio, fecha: o.fechaOperacion };
    return [
      {
        ...base,
        id: `${o.id}-divisa`,
        divisa: o.divisa,
        entrada: compra ? o.montoDivisa : 0,
        salida: compra ? 0 : o.montoDivisa,
      },
      {
        ...base,
        id: `${o.id}-mxn`,
        divisa: 'MXN' as const,
        entrada: compra ? 0 : o.montoMxn,
        salida: compra ? o.montoMxn : 0,
      },
    ];
  });
  return {
    resumen: {
      montoUsdMes: sumaUsd(delMes),
      operacionesMes: delMes.length,
      divisasMes: [...new Set(delMes.map((o) => o.divisa))],
      montoUsdHoy: sumaUsd(deHoy),
      limiteDiarioUsd: REGLAS_OPERACION.limiteDiarioUsd,
    },
    operaciones: propias.slice(0, OPERACIONES_RECIENTES).map((o) => ({
      id: o.id,
      folio: o.folio,
      fechaOperacion: o.fechaOperacion,
      tipo: o.tipo,
      divisa: o.divisa,
      montoDivisa: o.montoDivisa,
      montoUsd: o.montoUsd,
      esRelevante: o.esRelevante,
      estatus: o.estatus,
    })),
    movimientos,
  };
}

/**
 * Simulated backend of `clientes` (read-only this ola): a paged list with a free-text `busqueda`
 * (name, número, CURP, RFC, identificación) and `estatus`, `tipoPersona`, `nivel` filters; the detail with its audit
 * trail; and the cliente's operaciones with what it has operated against the daily limit.
 */
export const manejadorClientes: ManejadorApi = {
  responder(solicitud: HttpRequest<unknown>): HttpResponse<unknown> | null {
    if (solicitud.method !== 'GET') return null;

    if (solicitud.url === RUTAS_CLIENTES.lista) {
      const consulta = consultaDeParametros(parametrosPlanos(solicitud));
      const f = consulta.filtros;
      const filas = CLIENTES.filter(
        (c) =>
          (!f['estatus'] || c.estatus === f['estatus']) &&
          (!f['tipoPersona'] || c.tipoPersona === f['tipoPersona']) &&
          (!f['nivel'] || String(c.nivelExpediente) === f['nivel']) &&
          (!f['busqueda'] ||
            normalizar(
              `${c.nombreCompleto} ${c.numeroCliente} ${c.curp ?? ''} ${c.rfc} ${c.numeroIdentificacion}`,
            ).includes(normalizar(f['busqueda']))),
      ).map(aResumen);
      const ordenada = consulta.orden
        ? consulta
        : { ...consulta, orden: 'fechaAlta', direccion: 'desc' as const };
      return responderOk(
        solicitud,
        paginar(filas, ordenada, {
          numeroCliente: (c) => c.numeroCliente,
          nombreCompleto: (c) => c.nombreCompleto,
          fechaBase: (c) => c.fechaBase,
          nivelExpediente: (c) => c.nivelExpediente,
          estatus: (c) => c.estatus,
          fechaAlta: (c) => c.fechaAlta,
        }),
      );
    }

    if (solicitud.url.startsWith(RUTAS_CLIENTES.detalle)) {
      const resto = solicitud.url.slice(RUTAS_CLIENTES.detalle.length);
      if (resto.endsWith(RUTAS_CLIENTES.sufijoOperaciones)) {
        const clienteId = decodeURIComponent(
          resto.slice(0, resto.length - RUTAS_CLIENTES.sufijoOperaciones.length),
        );
        if (!CLIENTES.some((c) => c.id === clienteId)) {
          return rechazar(solicitud, 404, 'CLIENTE_NO_ENCONTRADO');
        }
        return responderOk(solicitud, operacionesDe(clienteId));
      }
    }

    const id = idDeRuta(solicitud, RUTAS_CLIENTES.detalle);
    if (id) {
      const cliente = CLIENTES.find((c) => c.id === id);
      if (!cliente) return rechazar(solicitud, 404, 'CLIENTE_NO_ENCONTRADO');
      const detalle: ClienteDetalleDto = {
        cliente,
        auditoria: AUDITORIA.filter((a) => a.entidad === 'cliente' && a.entidadId === id),
      };
      return responderOk(solicitud, detalle);
    }
    return null;
  },
};

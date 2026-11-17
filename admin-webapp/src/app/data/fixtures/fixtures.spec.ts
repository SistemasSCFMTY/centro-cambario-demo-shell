import { REGLAS_OPERACION } from '@data/constants/reglas-operacion.constants';
import {
  AUDITORIA,
  FECHA_BAJA_TIJUANA,
  fechaCambioEstatus,
} from '@data/fixtures/auditoria.fixture';
import { CAJAS, EXISTENCIAS_CAJA } from '@data/fixtures/cajas.fixture';
import { CAJEROS } from '@data/fixtures/cajeros.fixture';
import { CLIENTES } from '@data/fixtures/clientes.fixture';
import { DIVISAS } from '@data/fixtures/divisas.fixture';
import { CENTRO_CAMBIARIO, SUCURSALES } from '@data/fixtures/negocio.fixture';
import { OPERACIONES } from '@data/fixtures/operaciones.fixture';
import { FIX_DIARIO, TIPOS_CAMBIO_VENTANILLA } from '@data/fixtures/tipos-cambio.fixture';
import { esDiaHabil, hoyIso, sumarDias } from '@utils/fechas/fechas';

const ids = (lista: readonly { id: string }[]) => new Set(lista.map((e) => e.id));

describe('fixtures', () => {
  it('has MXN as the only base currency and the five seed currencies', () => {
    expect(DIVISAS.filter((d) => d.base).map((d) => d.clave)).toEqual(['MXN']);
    expect(DIVISAS.map((d) => d.clave)).toEqual(['MXN', 'USD', 'EUR', 'JPY', 'CNY', 'KRW']);
  });

  it('has three sucursales with CNBV-shaped keys, one in baja', () => {
    expect(SUCURSALES).toHaveLength(3);
    for (const s of SUCURSALES) {
      expect(s.localidad).toMatch(/^\d{8}$/);
      expect(s.codigoPostal).toMatch(/^\d{5}$/);
      expect(s.clave).toMatch(/^[A-Z0-9_-]{2,15}$/);
    }
    expect(SUCURSALES.filter((s) => s.estatus === 'BAJA')).toHaveLength(1);
    for (const s of SUCURSALES) {
      expect(s.calle && s.numeroExterior && s.colonia && s.municipio && s.entidad).toBeTruthy();
      expect(s.localidadDescripcion).not.toBe('');
      if (s.responsableId) {
        expect(CAJEROS.some((c) => c.id === s.responsableId)).toBe(true);
      }
    }
    expect(ids(SUCURSALES).has(CENTRO_CAMBIARIO.sucursalMatrizId)).toBe(true);
  });

  it('puts every cajero and caja in a known sucursal, with a balance per currency', () => {
    const sucursales = ids(SUCURSALES);
    expect(CAJEROS.every((c) => sucursales.has(c.sucursalId))).toBe(true);
    expect(CAJAS.every((c) => sucursales.has(c.sucursalId))).toBe(true);
    expect(CAJAS.filter((c) => c.tipo === 'BOVEDA')).toHaveLength(3);
    expect(EXISTENCIAS_CAJA).toHaveLength(CAJAS.length * DIVISAS.length);
  });

  it('has clientes of both kinds and mixed estatus', () => {
    expect(new Set(CLIENTES.map((c) => c.tipoPersona))).toEqual(new Set(['PF', 'PM']));
    expect(new Set(CLIENTES.map((c) => c.estatus))).toEqual(
      new Set(['ACTIVO', 'SUSPENDIDO', 'BLOQUEADO']),
    );
    expect(CLIENTES.every((c) => (c.tipoPersona === 'PM') === (c.curp === null))).toBe(true);
  });

  it('publishes the FIX on business days only, today included when it is one', () => {
    expect(FIX_DIARIO.every((f) => esDiaHabil(f.fecha))).toBe(true);
    expect(FIX_DIARIO.some((f) => f.fecha === hoyIso())).toBe(esDiaHabil(hoyIso()));
    expect(TIPOS_CAMBIO_VENTANILLA.every((t) => t.compra < t.venta)).toBe(true);
  });
});

describe('operaciones fixture', () => {
  const cajeros = ids(CAJEROS);
  const clientes = ids(CLIENTES);
  const sucursales = ids(SUCURSALES);
  const cajas = ids(CAJAS);

  it('references only known records', () => {
    for (const o of OPERACIONES) {
      expect(cajeros.has(o.cajeroId)).toBe(true);
      expect(sucursales.has(o.sucursalId)).toBe(true);
      expect(cajas.has(o.cajaId)).toBe(true);
      expect(o.clienteId === null || clientes.has(o.clienteId)).toBe(true);
    }
  });

  it('has unique ids and folios in the demo format', () => {
    expect(new Set(OPERACIONES.map((o) => o.id)).size).toBe(OPERACIONES.length);
    expect(new Set(OPERACIONES.map((o) => o.folio)).size).toBe(OPERACIONES.length);
    expect(OPERACIONES.every((o) => /^OP-\d{8}-\d{4}$/.test(o.folio))).toBe(true);
  });

  it('spans several weeks and includes every estatus, relevantes and pending ones', () => {
    const hoy = hoyIso();
    expect(OPERACIONES.some((o) => o.fechaOperacion.startsWith(hoy))).toBe(true);
    expect(OPERACIONES.some((o) => o.fechaOperacion.slice(0, 10) <= sumarDias(hoy, -21))).toBe(
      true,
    );
    expect(new Set(OPERACIONES.map((o) => o.estatus))).toEqual(
      new Set(['COMPLETADA', 'PENDIENTE_AUTORIZACION', 'RECHAZADA', 'CANCELADA']),
    );
    expect(OPERACIONES.some((o) => o.esRelevante)).toBe(true);
    expect(OPERACIONES.some((o) => o.reportableCompraUsd)).toBe(true);
  });

  it('applies the demo rules to every operation', () => {
    for (const o of OPERACIONES) {
      expect(o.montoMxn).toBeCloseTo(o.montoDivisa * o.tipoCambio, 1);
      expect(o.montoUsd).toBeGreaterThan(0);
      expect(esDiaHabil(o.fixFecha)).toBe(true);
      expect(o.fixFecha < o.fechaOperacion.slice(0, 10)).toBe(true);
      expect(o.requiereAutorizacion).toBe(o.motivoAutorizacion !== null);
      if (o.estatus === 'PENDIENTE_AUTORIZACION') expect(o.autorizadoEn).toBeNull();
      if (o.clienteId === null) expect(o.montoUsd).toBeLessThan(REGLAS_OPERACION.umbralNivel1Usd);
    }
  });

  it('keeps each cliente within their expediente level and the daily limit', () => {
    const porDia = new Map<string, number>();
    for (const o of OPERACIONES) {
      const cliente = CLIENTES.find((c) => c.id === o.clienteId);
      if (!cliente) continue;
      expect(cliente.nivelExpediente).toBeGreaterThanOrEqual(o.nivelRequerido);
      if (o.estatus === 'RECHAZADA' || o.estatus === 'CANCELADA') continue;
      const clave = `${cliente.id}|${o.fechaOperacion.slice(0, 10)}`;
      porDia.set(clave, (porDia.get(clave) ?? 0) + o.montoUsd);
    }
    for (const total of porDia.values()) {
      expect(total).toBeLessThanOrEqual(REGLAS_OPERACION.limiteDiarioUsd);
    }
  });
});

describe('operaciones fixture over time', () => {
  it('has no operation by a cliente after their estatus change or ID expiry', () => {
    for (const o of OPERACIONES) {
      const cliente = CLIENTES.find((c) => c.id === o.clienteId);
      if (!cliente) continue;
      const dia = o.fechaOperacion.slice(0, 10);
      if (cliente.estatus !== 'ACTIVO') {
        expect(o.fechaOperacion <= fechaCambioEstatus(cliente.id, cliente.fechaAlta)).toBe(true);
      }
      if (cliente.vencimientoIdentificacion && o.nivelRequerido > 0) {
        expect(dia <= cliente.vencimientoIdentificacion).toBe(true);
      }
    }
  });

  it('has no operation at a sucursal after its baja', () => {
    for (const o of OPERACIONES.filter((op) => op.sucursalId === 'suc-tij')) {
      expect(o.fechaOperacion.slice(0, 10) <= FECHA_BAJA_TIJUANA).toBe(true);
    }
  });

  it("only today's operations on a caja with a session", () => {
    const hoy = hoyIso();
    for (const o of OPERACIONES.filter((op) => op.fechaOperacion.startsWith(hoy))) {
      expect(CAJAS.find((c) => c.id === o.cajaId)?.abiertaEn).toBeTruthy();
    }
  });
});

describe('auditoria fixture', () => {
  it('traces every operation back to its registration', () => {
    for (const o of OPERACIONES) {
      const traza = AUDITORIA.filter((a) => a.entidad === 'operacion' && a.entidadId === o.id);
      expect(traza.some((a) => a.accion === 'Operación registrada')).toBe(true);
    }
  });

  it('covers clientes, sucursales and the negocio', () => {
    expect(new Set(AUDITORIA.map((a) => a.entidad))).toEqual(
      new Set(['operacion', 'cliente', 'sucursal', 'negocio']),
    );
  });
});

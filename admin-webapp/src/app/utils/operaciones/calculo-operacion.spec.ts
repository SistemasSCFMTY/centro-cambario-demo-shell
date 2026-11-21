import { EntradaCalculoOperacion } from '@data/interfaces/entrada-calculo-operacion';
import { calcularOperacion, nivelRequeridoPorMonto } from '@utils/operaciones/calculo-operacion';

const base: EntradaCalculoOperacion = {
  tipo: 'COMPRA',
  instrumento: 'EFECTIVO',
  divisa: 'USD',
  montoDivisa: 500,
  tipoCambio: 17.2,
  fixTipoCambio: 17.4,
  cliente: null,
};

describe('nivelRequeridoPorMonto', () => {
  it('steps at 1,000 · 3,000 · 5,000 USD, inclusive', () => {
    expect(nivelRequeridoPorMonto(999.99)).toBe(0);
    expect(nivelRequeridoPorMonto(1000)).toBe(1);
    expect(nivelRequeridoPorMonto(3000)).toBe(2);
    expect(nivelRequeridoPorMonto(5000)).toBe(3);
  });
});

describe('calcularOperacion', () => {
  it('asks for authorization of any operation by a foreign PEP', () => {
    const cliente = { tipoPersona: 'PF', gradoRiesgo: 'BAJO', tipoPep: 'EXTRANJERA' } as const;
    expect(calcularOperacion({ ...base, cliente }).motivosAutorizacion).toEqual([
      'Cliente PEP extranjera (16ª)',
    ]);
    expect(
      calcularOperacion({ ...base, cliente: { ...cliente, tipoPep: 'NACIONAL' } })
        .motivosAutorizacion,
    ).toEqual([]);
  });

  it('takes USD at face value and pesos at the counter rate', () => {
    const r = calcularOperacion(base);
    expect(r.montoMxn).toBe(8600);
    expect(r.montoUsd).toBe(500);
    expect(r.nivelRequerido).toBe(0);
    expect(r.esRelevante).toBe(false);
  });

  it('converts other currencies through the FIX', () => {
    const r = calcularOperacion({
      ...base,
      divisa: 'EUR',
      montoDivisa: 1000,
      tipoCambio: 18.9,
      fixTipoCambio: 18,
    });
    expect(r.montoMxn).toBe(18900);
    expect(r.montoUsd).toBe(1050);
    expect(r.nivelRequerido).toBe(1);
  });

  it('flags relevante for cash-like instruments from 5,000 USD', () => {
    expect(calcularOperacion({ ...base, montoDivisa: 5000 }).esRelevante).toBe(true);
    expect(
      calcularOperacion({ ...base, instrumento: 'CHEQUE_VIAJERO', montoDivisa: 6000 }).esRelevante,
    ).toBe(true);
    expect(
      calcularOperacion({ ...base, instrumento: 'TRANSFERENCIA', montoDivisa: 6000 }).esRelevante,
    ).toBe(false);
  });

  it('flags a USD cash purchase above 1,000 as reportable, only on purchases', () => {
    expect(calcularOperacion({ ...base, montoDivisa: 1000 }).reportableCompraUsd).toBe(false);
    expect(calcularOperacion({ ...base, montoDivisa: 1000.01 }).reportableCompraUsd).toBe(true);
    expect(
      calcularOperacion({ ...base, tipo: 'VENTA', montoDivisa: 2000 }).reportableCompraUsd,
    ).toBe(false);
  });

  it('asks for authorization on cash above 5,000 USD from a registered cliente', () => {
    const cliente = { tipoPersona: 'PF' as const, gradoRiesgo: 'BAJO' as const, tipoPep: null };
    expect(calcularOperacion({ ...base, montoDivisa: 5000, cliente }).motivosAutorizacion).toEqual(
      [],
    );
    expect(
      calcularOperacion({ ...base, montoDivisa: 5000.5, cliente }).motivosAutorizacion,
    ).toEqual(['Operación en efectivo de persona física superior a USD 5,000 (9ª)']);
    expect(calcularOperacion({ ...base, montoDivisa: 6000 }).motivosAutorizacion).toEqual([]);
  });

  it('asks for authorization from a high-risk cliente whatever the amount', () => {
    const cliente = { tipoPersona: 'PM' as const, gradoRiesgo: 'ALTO' as const, tipoPep: null };
    expect(calcularOperacion({ ...base, cliente }).motivosAutorizacion).toEqual([
      'Cliente de grado de riesgo alto (17ª)',
    ]);
  });
});

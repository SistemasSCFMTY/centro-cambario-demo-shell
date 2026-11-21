import {
  formatearMonto,
  formatearNumero,
  formatearTipoCambio,
  redondear,
} from '@utils/dinero/formato-dinero';

describe('formato de dinero', () => {
  it('rounds without the floating point slip', () => {
    expect(redondear(1.005)).toBe(1.01);
    expect(redondear(2.345, 2)).toBe(2.35);
    expect(redondear(0.1 + 0.2)).toBe(0.3);
    expect(redondear(17.12346, 4)).toBe(17.1235);
  });

  it('formats numbers with es-MX separators', () => {
    expect(formatearNumero(1234.5)).toBe('1,234.50');
    expect(formatearNumero(1234.5, 0)).toBe('1,235');
  });

  it('shows a dash for a missing value', () => {
    expect(formatearNumero(null)).toBe('—');
    expect(formatearNumero(undefined)).toBe('—');
    expect(formatearMonto(null, 'USD')).toBe('—');
  });

  it('writes every currency with its ISO key, MXN included', () => {
    expect(formatearMonto(1234.5, 'MXN')).toBe('MXN 1,234.50');
    expect(formatearMonto(1234.5, 'USD')).toBe('USD 1,234.50');
    expect(formatearMonto(-10, 'EUR')).toBe('-EUR 10.00');
    expect(formatearMonto(-0.001, 'USD')).toBe('USD 0.00');
  });

  it('shows no decimals for JPY and KRW', () => {
    expect(formatearMonto(15000, 'JPY')).toBe('JPY 15,000');
    expect(formatearMonto(250000, 'KRW')).toBe('KRW 250,000');
  });

  it('takes a decimals override', () => {
    expect(formatearMonto(3000, 'USD', 0)).toBe('USD 3,000');
  });

  it('formats a rate with four decimals', () => {
    expect(formatearTipoCambio(17.4)).toBe('17.4000');
  });
});

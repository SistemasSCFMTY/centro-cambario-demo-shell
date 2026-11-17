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

  it('formats MXN with a symbol and the others with their ISO key', () => {
    expect(formatearMonto(1234.5, 'MXN')).toBe('$1,234.50');
    expect(formatearMonto(1234.5, 'USD')).toMatch(/^USD\s1,234\.50$/);
  });

  it('shows no decimals for JPY and KRW', () => {
    expect(formatearMonto(15000, 'JPY')).toMatch(/^JPY\s15,000$/);
    expect(formatearMonto(250000, 'KRW')).toMatch(/^KRW\s250,000$/);
  });

  it('formats a rate with four decimals', () => {
    expect(formatearTipoCambio(17.4)).toBe('17.4000');
  });
});

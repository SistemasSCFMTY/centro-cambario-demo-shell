import { CodigoDivisa } from '@data/types/divisa.types';

const VACIO = '—';

/** Round to `decimales` places without the 1.005 → 1.00 slip. */
export function redondear(valor: number, decimales = 2): number {
  const factor = 10 ** decimales;
  return Math.round((valor + Number.EPSILON) * factor) / factor;
}

/** `1,234.50`; `—` for a missing value. */
export function formatearNumero(valor: number | null | undefined, decimales = 2): string {
  if (valor === null || valor === undefined || Number.isNaN(valor)) return VACIO;
  return valor.toLocaleString('es-MX', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
}

/** The decimals a currency is written with (ISO 4217 minor units): 2, or 0 for JPY and KRW. */
export function currencyDecimals(currency: CodigoDivisa): number {
  return (
    new Intl.NumberFormat('es-MX', { style: 'currency', currency }).resolvedOptions()
      .maximumFractionDigits ?? 2
  );
}

/**
 * An amount in a currency, always with its ISO key (lead, 2026-11-20): `MXN 1,234.50`,
 * `USD 1,234.50`, `JPY 15,000`; a negative amount reads `-MXN 1,234.50`. `decimals` overrides the
 * currency's own (a threshold written as `USD 3,000`).
 */
export function formatearMonto(
  valor: number | null | undefined,
  divisa: CodigoDivisa,
  decimals = currencyDecimals(divisa),
): string {
  if (valor === null || valor === undefined || Number.isNaN(valor)) return VACIO;
  const sign = redondear(valor, decimals) < 0 ? '-' : '';
  return `${sign}${divisa} ${formatearNumero(Math.abs(valor), decimals)}`;
}

/** A rate, MXN per unit, with its 4 decimals. */
export function formatearTipoCambio(valor: number | null | undefined): string {
  return formatearNumero(valor, 4);
}

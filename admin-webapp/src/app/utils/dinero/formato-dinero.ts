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

/** An amount in a currency: `$1,234.50` for MXN, `USD 1,234.50` for the rest. JPY and KRW show no decimals. */
export function formatearMonto(valor: number | null | undefined, divisa: CodigoDivisa): string {
  if (valor === null || valor === undefined || Number.isNaN(valor)) return VACIO;
  return valor.toLocaleString('es-MX', { style: 'currency', currency: divisa });
}

/** A rate, MXN per unit, with its 4 decimals. */
export function formatearTipoCambio(valor: number | null | undefined): string {
  return formatearNumero(valor, 4);
}

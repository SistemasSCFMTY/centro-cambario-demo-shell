import { CodigoDivisa } from '@data/types/divisa.types';

export const DIVISA_BASE: CodigoDivisa = 'MXN';

/** Phase 1 reference parity: units of each currency per 1 USD, to quote the seed rates. */
export const UNIDADES_POR_USD: Record<CodigoDivisa, number> = {
  MXN: 1,
  USD: 1,
  EUR: 0.92,
  JPY: 150,
  CNY: 7.2,
  KRW: 1370,
};

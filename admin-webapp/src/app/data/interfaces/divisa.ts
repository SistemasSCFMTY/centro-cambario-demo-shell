import { CodigoDivisa } from '@data/types/divisa.types';

export interface Divisa {
  /** ISO 4217 key. */
  clave: CodigoDivisa;
  nombre: string;
  simbolo: string;
  /** Minor units: 2 for most, 0 for JPY and KRW. */
  decimales: number;
  /** True for MXN: the currency every rate is quoted against. */
  base: boolean;
}

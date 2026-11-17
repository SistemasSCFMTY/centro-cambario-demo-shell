import { CodigoDivisa } from '@data/types/divisa.types';

/** The amount a movement carries in one currency. */
export interface MontoMovimiento {
  divisa: CodigoDivisa;
  monto: number;
}

import { CodigoDivisa } from '@data/types/divisa.types';

/** What was counted of one currency against what the system said. `diferencia` is contado − sistema. */
export interface ConteoMoneda {
  divisa: CodigoDivisa;
  sistema: number;
  contado: number;
  diferencia: number;
}

import { CodigoDivisa } from '@data/types/divisa.types';

/** What a caja holds of one currency right now. */
export interface ExistenciaCaja {
  cajaId: string;
  divisa: CodigoDivisa;
  saldo: number;
}

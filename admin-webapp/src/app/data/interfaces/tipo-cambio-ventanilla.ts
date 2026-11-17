import { CodigoDivisa } from '@data/types/divisa.types';

/** The counter rate of one currency at one sucursal, MXN per unit. */
export interface TipoCambioVentanilla {
  sucursalId: string;
  divisa: CodigoDivisa;
  /** What the centro pays when it buys. */
  compra: number;
  /** What the centro charges when it sells. */
  venta: number;
  /** Local ISO date-time. */
  vigenteDesde: string;
}

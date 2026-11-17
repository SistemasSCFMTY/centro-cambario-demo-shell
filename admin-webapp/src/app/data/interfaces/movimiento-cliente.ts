import { CodigoDivisa } from '@data/types/divisa.types';

/** A line of the cliente's cash ledger: what entered or left in one currency in an operación. */
export interface MovimientoCliente {
  id: string;
  operacionId: string;
  folio: string;
  /** Local ISO date-time. */
  fecha: string;
  divisa: CodigoDivisa;
  /** Cash that entered; 0 when it left. */
  entrada: number;
  /** Cash that left; 0 when it entered. */
  salida: number;
}

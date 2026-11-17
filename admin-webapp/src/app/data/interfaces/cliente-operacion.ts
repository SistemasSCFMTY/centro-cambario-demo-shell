import { CodigoDivisa } from '@data/types/divisa.types';
import { EstatusOperacion, TipoOperacion } from '@data/types/operacion.types';

/** A row of the operaciones a cliente has made, as its detail lists them. */
export interface ClienteOperacion {
  id: string;
  folio: string;
  /** Local ISO date-time. */
  fechaOperacion: string;
  tipo: TipoOperacion;
  divisa: CodigoDivisa;
  montoDivisa: number;
  montoUsd: number;
  esRelevante: boolean;
  estatus: EstatusOperacion;
}

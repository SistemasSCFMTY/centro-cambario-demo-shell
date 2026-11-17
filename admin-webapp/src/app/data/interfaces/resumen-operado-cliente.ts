import { CodigoDivisa } from '@data/types/divisa.types';

/** What a cliente has operated: the calendar month and today against the daily limit (USD). */
export interface ResumenOperadoCliente {
  /** Equivalent in USD of the month's COMPLETADA operaciones. */
  montoUsdMes: number;
  /** COMPLETADA operaciones of the calendar month. */
  operacionesMes: number;
  /** Distinct divisas of the month's COMPLETADA operaciones. */
  divisasMes: CodigoDivisa[];
  /** Equivalent in USD of today's COMPLETADA and PENDIENTE_AUTORIZACION operaciones. */
  montoUsdHoy: number;
  limiteDiarioUsd: number;
}

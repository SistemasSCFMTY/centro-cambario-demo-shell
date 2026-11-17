/** The demo's operation parameters (plans/02 Operation rules), all in USD. Phase 1 literals; Phase 2 reads them from backend-api. */
export const REGLAS_OPERACION = {
  /** From this amount per operation the cliente's basic data are required (>=). */
  umbralNivel1Usd: 1000,
  /** Copy of the ID is required too (>=). */
  umbralNivel2Usd: 3000,
  /** The full expediente is required (>=). */
  umbralNivel3Usd: 5000,
  /** Operación relevante: cash-like instruments at or above this (>=). */
  umbralRelevanteUsd: 5000,
  /** Purchases of USD in cash above this go in the quarterly report (>). */
  umbralReporteCompraEfectivoUsd: 1000,
  /** Cash by a persona física above this needs authorization (>). */
  umbralEscalamientoPfUsd: 5000,
  /** Cash by a persona moral above this needs authorization (>). */
  umbralEscalamientoPmUsd: 5000,
  /** Most a cliente may operate in one day (art. 81-A LGOAAC). */
  limiteDiarioUsd: 10000,
} as const;

/** The FIX (USD/MXN) Banxico publishes each business day. */
export interface TipoCambioFix {
  /** ISO date of the publication. */
  fecha: string;
  tipoCambio: number;
  fuente: string;
}

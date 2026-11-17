import { AjustePill } from '@data/interfaces/ajuste-pill';

/** One label + value of a detail view's field grid. An empty value renders `—`. */
export interface CampoDetalle {
  etiqueta: string;
  valor?: string | number | null;
  /** Numeric, ID or date value: `font-data`. */
  dato?: boolean;
  /** Renders `valor` as a router link. */
  enlace?: readonly string[];
  /** Renders a status pill instead of `valor`. */
  pill?: AjustePill;
}

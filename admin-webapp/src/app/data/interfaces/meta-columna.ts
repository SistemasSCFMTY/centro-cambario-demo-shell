/** Per-column presentation read by the data table. */
export interface MetaColumna {
  /** Numeric column: right-aligned `font-data`. */
  numerica?: boolean;
  /** The header text stays for screen readers only (an actions column). */
  encabezadoOculto?: boolean;
}

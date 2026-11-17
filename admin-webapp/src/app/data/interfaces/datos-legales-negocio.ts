/** The legal data of the centro (plans/04 Legal tab). Dates are ISO `YYYY-MM-DD`. */
export interface DatosLegales {
  /** CASFIM, `99-999`; columna 4 of the official format. */
  claveOrganoSupervisor: string;
  /** 8 digits: 0 + sector (2) + clave asignada por la CNBV (5); columna 5. */
  claveCentro: string;
  /** CASFIM, `99-999`; goes in the dollar report (.FDE). */
  claveEntidad: string;
  numeroRegistro: string;
  fechaRegistro: string;
  dictamenNumero: string | null;
  dictamenEmision: string | null;
  dictamenVigencia: string | null;
  escrituraNumero: string;
  escrituraFecha: string;
  notarioNombre: string;
  notarioNumero: string;
  notarioEntidad: string;
  folioMercantil: string;
  representanteNombre: string;
  representanteRfc: string;
  representanteCurp: string;
  poderEscrituraNumero: string;
  poderFecha: string;
  poderNotario: string;
  /** The usuario designated as Oficial de Cumplimiento. */
  oficialUsuarioId: string;
  oficialFechaDesignacion: string;
  oficialFechaNotificacion: string | null;
}

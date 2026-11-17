/** A row of `catalogos/localidades.json` (CNBV, LOCALIDAD). */
export interface RegistroLocalidad {
  /** 8 digits. */
  clave: string;
  descripcion: string;
  /** Name of the state or country, as the 2017 package wrote it; null in a few rows. */
  estado: string | null;
}

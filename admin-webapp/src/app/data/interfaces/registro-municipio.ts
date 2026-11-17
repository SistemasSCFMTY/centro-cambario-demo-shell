/** A row of `catalogos/municipios.json` (CNBV, DELEGACION_MUNICIPIO). */
export interface RegistroMunicipio {
  clave: string;
  descripcion: string;
  /** The first two digits of `clave`. */
  claveEntidad: string;
}

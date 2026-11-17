/** What the sucursal form sends (alta and corrección); an empty string means «sin dato». */
export interface DatosSucursal {
  clave: string;
  nombre: string;
  /** Id of a usuario, or empty. */
  responsableId: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  colonia: string;
  /** 5 digits, or empty. */
  codigoPostal: string;
  entidad: string;
  municipio: string;
  /** CNBV localidad key, 8 digits, or empty. The backend fills its description from the catalog. */
  localidad: string;
  telefono: string;
  horario: string;
}

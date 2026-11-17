/** The parts of a postal address that read as one line. */
export interface DomicilioEnLinea {
  calle: string;
  numeroExterior: string;
  numeroInterior: string | null;
  colonia: string;
  municipio: string;
}

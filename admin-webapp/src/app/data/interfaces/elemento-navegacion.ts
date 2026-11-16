export interface ElementoNavegacion {
  etiqueta: string;
  /** Route path, without the leading slash. */
  ruta: string;
  /** Lucide icon name, registered in ICONOS_NAVEGACION. */
  icono: string;
  /** The page header's description. */
  descripcion: string;
}

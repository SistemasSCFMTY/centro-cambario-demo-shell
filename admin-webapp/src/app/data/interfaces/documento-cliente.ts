export interface DocumentoCliente {
  id: string;
  tipo: string;
  nombreArchivo: string;
  tamanoBytes: number;
  /** ISO date of the document itself. */
  fechaDocumento: string;
  cotejadoOriginal: boolean;
}

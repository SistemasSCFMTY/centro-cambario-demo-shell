import { TipoDocumentoLegal } from '@data/types/negocio.types';

/** A legal document on file. Phase 1 lists them; the upload comes with the expediente's file handling. */
export interface DocumentoLegal {
  id: string;
  tipo: TipoDocumentoLegal;
  /** File name; null while the document hasn't been uploaded. */
  archivo: string | null;
  tamanoKb: number | null;
  /** ISO date the file was added. */
  fecha: string | null;
  /** ISO date the document stops being valid; null when it doesn't expire. */
  vigencia: string | null;
}

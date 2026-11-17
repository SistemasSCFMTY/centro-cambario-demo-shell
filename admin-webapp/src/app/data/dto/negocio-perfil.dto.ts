import { CentroCambiario } from '@data/interfaces/centro-cambiario';
import { DatosLegales } from '@data/interfaces/datos-legales-negocio';
import { DocumentoLegal } from '@data/interfaces/documento-legal-negocio';

/** What `GET /negocio` answers: the profile, its legal data and its documents. */
export interface PerfilNegocioDto {
  centro: CentroCambiario;
  legal: DatosLegales;
  documentos: DocumentoLegal[];
}

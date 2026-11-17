import { OpcionCatalogo } from '@data/interfaces/opcion-catalogo';
import { OpcionesNegocio } from '@data/interfaces/opciones-negocio';

/** The lists a negocio form draws: the server's plus the ones that follow the entidad and the municipio picked. */
export interface OpcionesFormularioNegocio extends OpcionesNegocio {
  /** Municipios of the entidad picked. */
  municipios: OpcionCatalogo[];
  /** Localidades of the municipio picked. */
  localidades: OpcionCatalogo[];
}

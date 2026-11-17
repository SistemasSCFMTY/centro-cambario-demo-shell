import { CentroCambiario } from '@data/interfaces/centro-cambiario';
import { DatosLegales } from '@data/interfaces/datos-legales-negocio';

/** What the edit form sends. The daily limit is a parameter of the operations, not edited here. */
export interface GuardarNegocioDto {
  centro: Omit<CentroCambiario, 'limiteDiarioUsd'>;
  legal: DatosLegales;
}

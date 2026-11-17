import { FiltroAuditoriaNegocio } from '@data/types/negocio.types';

/** One option of the Auditoría tab's filter. */
export interface OpcionFiltroAuditoriaNegocio {
  valor: FiltroAuditoriaNegocio;
  etiqueta: string;
}

import { ConteoMoneda } from '@data/interfaces/conteo-moneda';
import { TipoConteo } from '@data/types/conteo-caja.types';

/** A count of a caja: apertura, arqueo or corte, with every currency it covers. */
export interface ConteoCaja {
  id: string;
  cajaId: string;
  sesionId: string;
  tipo: TipoConteo;
  /** The cajero in charge of the session the count belongs to. */
  responsableId: string;
  /** The cajero or usuario who counted. An arqueo is counted by someone other than the responsable. */
  realizadoPorId: string;
  /** Local ISO date-time. */
  realizadoEn: string;
  observaciones: string | null;
  detalle: ConteoMoneda[];
}

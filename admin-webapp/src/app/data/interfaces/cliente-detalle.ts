import { ClienteResumen } from '@data/interfaces/cliente-resumen';
import { DocumentoCliente } from '@data/interfaces/documento-cliente';

/** What the cliente detail ("360") reads, besides the summary. */
export interface ClienteDetalle extends ClienteResumen {
  nacionalidad: string;
  /** Ocupación (PF) or giro (PM). */
  actividad: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  /** ISO date; null when the ID has no expiry. */
  vencimientoIdentificacion: string | null;
  domicilio: string;
  telefono: string;
  correo: string;
  origenRecursos: string;
  destinoRecursos: string;
  /** Why the estatus isn't ACTIVO; null while it is. */
  motivoEstatus: string | null;
  /** Legal representative of a persona moral. */
  representante: string | null;
  documentos: DocumentoCliente[];
}

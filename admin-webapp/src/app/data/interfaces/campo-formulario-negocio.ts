import {
  DestinoCampoNegocio,
  FuenteOpcionesNegocio,
  TipoCampoFormulario,
} from '@data/types/negocio.types';

/** One field of a negocio form: how it is drawn and how it is validated. */
export interface CampoFormulario {
  /** The form control name; for the edit form, also the property it is saved into. */
  id: string;
  etiqueta: string;
  tipo: TipoCampoFormulario;
  /** Edit form only: where the value is saved. */
  destino?: DestinoCampoNegocio;
  requerido?: boolean;
  /** An empty value is saved as `null`. */
  nulable?: boolean;
  maxLongitud?: number;
  patron?: RegExp;
  correo?: boolean;
  /** A date that can't be after today. */
  noFutura?: boolean;
  /** A date that can't be before the date of this other field. */
  noAnteriorA?: string;
  /** Numbers, dates and keys: `font-data`. */
  dato?: boolean;
  /** Typed in lowercase, kept in uppercase. */
  mayusculas?: boolean;
  /** One line under the control. */
  ayuda?: string;
  mensajeRequerido?: string;
  mensajeFormato?: string;
  fuenteOpciones?: FuenteOpcionesNegocio;
  /** What the select says while it has no options yet. */
  textoSinOpciones?: string;
  /** Takes the whole row of its section. */
  completo?: boolean;
}

import { EstatusCliente, GradoRiesgo, TipoPep, TipoPersona } from '@data/types/cliente.types';
import { NivelExpediente } from '@data/types/operacion.types';

/** What a clientes list row needs. */
export interface ClienteResumen {
  id: string;
  /** `C-000101`. */
  numeroCliente: string;
  tipoPersona: TipoPersona;
  /** Name, or the denominación of a persona moral. */
  nombreCompleto: string;
  /** ISO date: birth (PF) or constitution (PM). */
  fechaBase: string;
  curp: string | null;
  rfc: string;
  nivelExpediente: NivelExpediente;
  gradoRiesgo: GradoRiesgo;
  esPep: boolean;
  /** Null when `esPep` is false. */
  tipoPep: TipoPep | null;
  estatus: EstatusCliente;
  /** ISO date. */
  fechaAlta: string;
}

import { NivelExpediente } from '@data/types/operacion.types';

export interface ResultadoCalculoOperacion {
  montoMxn: number;
  montoUsd: number;
  nivelRequerido: NivelExpediente;
  esRelevante: boolean;
  reportableCompraUsd: boolean;
  /** The instrument is cash. */
  efectivo: boolean;
  /** Why the operation needs an authorizer; empty when it doesn't. */
  motivosAutorizacion: string[];
}

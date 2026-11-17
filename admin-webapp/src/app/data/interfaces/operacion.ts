import { CodigoDivisa } from '@data/types/divisa.types';
import {
  EstatusOperacion,
  InstrumentoMonetario,
  NivelExpediente,
  TipoOperacion,
} from '@data/types/operacion.types';

/** An exchange buy or sell, with the figures the demo computes when it's registered. */
export interface Operacion {
  id: string;
  /** `OP-20261116-0003`. */
  folio: string;
  /** Local ISO date-time. */
  fechaOperacion: string;
  tipo: TipoOperacion;
  instrumento: InstrumentoMonetario;
  divisa: CodigoDivisa;
  montoDivisa: number;
  /** Ventanilla rate used, MXN per unit of divisa. */
  tipoCambio: number;
  montoMxn: number;
  /** ISO date of the FIX applied: the previous business day's. */
  fixFecha: string;
  fixTipoCambio: number;
  /** Equivalent in USD: the amount itself for USD, otherwise pesos ÷ FIX. */
  montoUsd: number;
  nivelRequerido: NivelExpediente;
  /** Cash-like operation at or above the relevante threshold (2ª fr. XX). */
  esRelevante: boolean;
  /** Purchase of USD in cash above the quarterly report threshold (23ª). */
  reportableCompraUsd: boolean;
  requiereAutorizacion: boolean;
  motivoAutorizacion: string | null;
  estatus: EstatusOperacion;
  autorizadoPorId: string | null;
  autorizadoEn: string | null;
  comentarioAutorizacion: string | null;
  sucursalId: string;
  cajaId: string;
  cajeroId: string;
  /** Null for an occasional cliente. */
  clienteId: string | null;
  nombreOcasional: string | null;
  /** Declared by a registered cliente; null for an occasional one. */
  origenRecursos: string | null;
  destinoRecursos: string | null;
}

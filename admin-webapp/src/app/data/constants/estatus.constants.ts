import { AjustePill } from '@data/interfaces/ajuste-pill';
import { EstatusCaja } from '@data/types/caja.types';
import { EstatusCliente, GradoRiesgo } from '@data/types/cliente.types';
import { EstatusOperacion } from '@data/types/operacion.types';
import { EstatusSucursal } from '@data/types/sucursal.types';

/** Pill of each estatus. «No realizada» is the demo's wording for RECHAZADA. */
export const PILL_ESTATUS_OPERACION: Record<EstatusOperacion, AjustePill> = {
  COMPLETADA: { tono: 'success', etiqueta: 'Completada' },
  PENDIENTE_AUTORIZACION: { tono: 'warning', etiqueta: 'Pendiente de autorización' },
  RECHAZADA: { tono: 'danger', etiqueta: 'No realizada' },
  CANCELADA: { tono: 'neutral', etiqueta: 'Cancelada' },
};

export const PILL_ESTATUS_CLIENTE: Record<EstatusCliente, AjustePill> = {
  ACTIVO: { tono: 'success', etiqueta: 'Activo' },
  SUSPENDIDO: { tono: 'warning', etiqueta: 'Suspendido' },
  BLOQUEADO: { tono: 'danger', etiqueta: 'Bloqueado' },
};

export const PILL_GRADO_RIESGO: Record<GradoRiesgo, AjustePill> = {
  BAJO: { tono: 'success', etiqueta: 'Bajo' },
  MEDIO: { tono: 'warning', etiqueta: 'Medio' },
  ALTO: { tono: 'danger', etiqueta: 'Alto' },
};

export const PILL_ESTATUS_SUCURSAL: Record<EstatusSucursal, AjustePill> = {
  ACTIVA: { tono: 'success', etiqueta: 'Activa' },
  BAJA: { tono: 'neutral', etiqueta: 'Baja' },
};

export const PILL_ESTATUS_CAJA: Record<EstatusCaja, AjustePill> = {
  ABIERTA: { tono: 'success', etiqueta: 'Abierta' },
  CERRADA: { tono: 'neutral', etiqueta: 'Cerrada' },
  INACTIVA: { tono: 'neutral', etiqueta: 'Inactiva' },
};

export const PILL_RELEVANTE: AjustePill = { tono: 'info', etiqueta: 'Relevante' };
export const PILL_PEP: AjustePill = { tono: 'warning', etiqueta: 'PEP' };
export const PILL_PERSONA_MORAL: AjustePill = { tono: 'neutral', etiqueta: 'Persona moral' };

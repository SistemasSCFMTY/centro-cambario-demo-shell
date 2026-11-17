import { OpcionCatalogo } from '@data/interfaces/opcion-catalogo';
import { TipoCaja } from '@data/types/caja.types';
import { TipoPersona } from '@data/types/cliente.types';
import { InstrumentoMonetario, NivelExpediente, TipoOperacion } from '@data/types/operacion.types';

export const ETIQUETA_TIPO_OPERACION: Record<TipoOperacion, string> = {
  COMPRA: 'Compra',
  VENTA: 'Venta',
};

export const ETIQUETA_INSTRUMENTO: Record<InstrumentoMonetario, string> = {
  EFECTIVO: 'Efectivo',
  TRANSFERENCIA: 'Transferencia',
  CHEQUE_VIAJERO: 'Cheques de viajero',
};

/** Instruments the demo flags as cash (escalation, reportes) and as relevante. */
export const INSTRUMENTOS_EFECTIVO: readonly InstrumentoMonetario[] = ['EFECTIVO'];
export const INSTRUMENTOS_RELEVANTES: readonly InstrumentoMonetario[] = [
  'EFECTIVO',
  'CHEQUE_VIAJERO',
];

export const ETIQUETA_NIVEL: Record<NivelExpediente, string> = {
  0: 'Sin identificación',
  1: 'Nivel 1',
  2: 'Nivel 2',
  3: 'Nivel 3',
};

export const ETIQUETA_TIPO_PERSONA: Record<TipoPersona, string> = {
  PF: 'Persona física',
  PM: 'Persona moral',
};

export const ETIQUETA_TIPO_CAJA: Record<TipoCaja, string> = {
  CAJA: 'Caja',
  BOVEDA: 'Bóveda',
};

/** Origen de los recursos (demo catalog ORIGEN_RECURSOS). */
export const ORIGENES_RECURSOS: readonly OpcionCatalogo[] = [
  { clave: 'SALARIO', etiqueta: 'Sueldo o salario' },
  { clave: 'PENSION', etiqueta: 'Pensión' },
  { clave: 'AHORROS', etiqueta: 'Ahorros propios' },
  { clave: 'NEGOCIO', etiqueta: 'Ingresos de negocio propio' },
  { clave: 'HONORARIOS', etiqueta: 'Honorarios profesionales' },
  { clave: 'REMESAS', etiqueta: 'Remesas recibidas del extranjero' },
  { clave: 'VENTA_BIENES', etiqueta: 'Venta de bienes' },
  { clave: 'HERENCIA', etiqueta: 'Herencia o donación' },
  { clave: 'PRESTAMO', etiqueta: 'Préstamo' },
  { clave: 'PREMIO', etiqueta: 'Premio o sorteo' },
  { clave: 'OTRO', etiqueta: 'Otro' },
];

/** Destino de los recursos (demo catalog DESTINO_RECURSOS). */
export const DESTINOS_RECURSOS: readonly OpcionCatalogo[] = [
  { clave: 'VIAJE', etiqueta: 'Viaje o turismo' },
  { clave: 'PAGO_EXTRANJERO', etiqueta: 'Pagos en el extranjero' },
  { clave: 'MERCANCIA', etiqueta: 'Compra de mercancía' },
  { clave: 'AHORRO', etiqueta: 'Ahorro en moneda extranjera' },
  { clave: 'ENVIO_FAMILIAR', etiqueta: 'Envío a familiares' },
  { clave: 'COLEGIATURAS', etiqueta: 'Colegiaturas' },
  { clave: 'GASTOS_MX', etiqueta: 'Gastos en México' },
  { clave: 'OTRO', etiqueta: 'Otro' },
];

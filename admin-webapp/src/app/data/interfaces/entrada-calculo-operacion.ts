import { CodigoDivisa } from '@data/types/divisa.types';
import { GradoRiesgo, TipoPep, TipoPersona } from '@data/types/cliente.types';
import { InstrumentoMonetario, TipoOperacion } from '@data/types/operacion.types';

/** What the operation rules need to classify one operation. */
export interface EntradaCalculoOperacion {
  tipo: TipoOperacion;
  instrumento: InstrumentoMonetario;
  divisa: CodigoDivisa;
  montoDivisa: number;
  /** Ventanilla rate, MXN per unit of divisa. */
  tipoCambio: number;
  /** FIX of the previous business day, MXN per USD. */
  fixTipoCambio: number;
  /** Null for an occasional cliente. */
  cliente: { tipoPersona: TipoPersona; gradoRiesgo: GradoRiesgo; tipoPep: TipoPep | null } | null;
}

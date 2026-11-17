import { CodigoDivisa } from '@data/types/divisa.types';
import { InstrumentoMonetario, TipoOperacion } from '@data/types/operacion.types';

/**
 * One line of the operations fixture, before the rules fill in the rest:
 * days back from today, `HH:MM`, cajero id, cliente id (null = occasional), tipo, instrumento,
 * divisa, monto in that divisa, and how it ended when the rules alone wouldn't say.
 */
export type SemillaOperacion = readonly [
  dias: number,
  hora: string,
  cajeroId: string,
  clienteId: string | null,
  tipo: TipoOperacion,
  instrumento: InstrumentoMonetario,
  divisa: CodigoDivisa,
  monto: number,
  forzar?: 'RECHAZADA' | 'CANCELADA',
];

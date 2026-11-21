import { INSTRUMENTOS_EFECTIVO, INSTRUMENTOS_RELEVANTES } from '@data/constants/dominio.constants';
import { REGLAS_OPERACION } from '@data/constants/reglas-operacion.constants';
import { EntradaCalculoOperacion } from '@data/interfaces/entrada-calculo-operacion';
import { ResultadoCalculoOperacion } from '@data/interfaces/resultado-calculo-operacion';
import { NivelExpediente } from '@data/types/operacion.types';
import { formatearMonto, redondear } from '@utils/dinero/formato-dinero';

/** Required ID level for an operation of `usd` (the demo's `nivelPorMonto`). */
export function nivelRequeridoPorMonto(usd: number): NivelExpediente {
  if (usd >= REGLAS_OPERACION.umbralNivel3Usd) return 3;
  if (usd >= REGLAS_OPERACION.umbralNivel2Usd) return 2;
  if (usd >= REGLAS_OPERACION.umbralNivel1Usd) return 1;
  return 0;
}

/**
 * The demo's operation rules (plans/02): pesos, USD equivalent at the FIX, required ID level,
 * relevante and reportable classification, and why it needs authorization.
 */
export function calcularOperacion(entrada: EntradaCalculoOperacion): ResultadoCalculoOperacion {
  const montoMxn = redondear(entrada.montoDivisa * entrada.tipoCambio);
  const montoUsd =
    entrada.divisa === 'USD'
      ? redondear(entrada.montoDivisa)
      : redondear(montoMxn / entrada.fixTipoCambio);
  const efectivo = INSTRUMENTOS_EFECTIVO.includes(entrada.instrumento);

  const motivosAutorizacion: string[] = [];
  if (entrada.cliente && efectivo) {
    const moral = entrada.cliente.tipoPersona === 'PM';
    const umbral = moral
      ? REGLAS_OPERACION.umbralEscalamientoPmUsd
      : REGLAS_OPERACION.umbralEscalamientoPfUsd;
    if (montoUsd > umbral) {
      motivosAutorizacion.push(
        `Operación en efectivo de persona ${moral ? 'moral' : 'física'} superior a ${formatearMonto(umbral, 'USD', 0)} (9ª)`,
      );
    }
  }
  if (entrada.cliente?.gradoRiesgo === 'ALTO') {
    motivosAutorizacion.push('Cliente de grado de riesgo alto (17ª)');
  }

  if (entrada.cliente?.tipoPep === 'EXTRANJERA') {
    motivosAutorizacion.push('Cliente PEP extranjera (16ª)');
  }

  return {
    montoMxn,
    montoUsd,
    nivelRequerido: nivelRequeridoPorMonto(montoUsd),
    esRelevante:
      INSTRUMENTOS_RELEVANTES.includes(entrada.instrumento) &&
      montoUsd >= REGLAS_OPERACION.umbralRelevanteUsd,
    reportableCompraUsd:
      entrada.tipo === 'COMPRA' &&
      entrada.divisa === 'USD' &&
      efectivo &&
      montoUsd > REGLAS_OPERACION.umbralReporteCompraEfectivoUsd,
    efectivo,
    motivosAutorizacion,
  };
}

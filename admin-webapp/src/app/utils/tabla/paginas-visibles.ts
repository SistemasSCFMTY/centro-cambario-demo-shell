import { PAGINAS_VECINAS } from '@data/constants/lista.constants';

/**
 * The page buttons to draw: first, last, the current page with its neighbors, and `null` where a
 * gap collapses into an ellipsis. `[1, null, 4, 5, 6, null, 20]`.
 */
export function paginasVisibles(actual: number, total: number): (number | null)[] {
  const requeridas = new Set<number>([1, total]);
  for (let p = actual - PAGINAS_VECINAS; p <= actual + PAGINAS_VECINAS; p++) {
    if (p >= 1 && p <= total) requeridas.add(p);
  }
  const ordenadas = [...requeridas].sort((a, b) => a - b);
  const resultado: (number | null)[] = [];
  ordenadas.forEach((pagina, i) => {
    const anterior = ordenadas[i - 1];
    if (anterior !== undefined && pagina - anterior > 2) resultado.push(null);
    else if (anterior !== undefined && pagina - anterior === 2) resultado.push(anterior + 1);
    resultado.push(pagina);
  });
  return resultado;
}

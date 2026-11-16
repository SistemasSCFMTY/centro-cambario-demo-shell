/**
 * Up to two initials from a name: `Centro Cambiario Demo` → `CC`, `María de la Luz` → `ML`.
 * Lowercase connectors of two letters or fewer (de, la, y…) are skipped.
 */
export function iniciales(nombre: string): string {
  return nombre
    .trim()
    .split(/\s+/)
    .filter((palabra) => palabra.length > 2 || /^[A-ZÁÉÍÓÚÑ]/.test(palabra))
    .slice(0, 2)
    .map((palabra) => palabra[0].toUpperCase())
    .join('');
}

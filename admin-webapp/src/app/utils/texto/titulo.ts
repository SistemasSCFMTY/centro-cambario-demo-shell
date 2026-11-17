import { PALABRAS_MENORES_TITULO } from '@data/constants/catalogos.constants';

/** `SAN PEDRO GARZA GARCIA` → `San Pedro Garza Garcia`; small connectors stay lowercase (`Mier y Noriega`). */
export function aTitulo(texto: string): string {
  return texto
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((palabra, i) =>
      i > 0 && PALABRAS_MENORES_TITULO.includes(palabra)
        ? palabra
        : palabra.charAt(0).toUpperCase() + palabra.slice(1),
    )
    .join(' ');
}

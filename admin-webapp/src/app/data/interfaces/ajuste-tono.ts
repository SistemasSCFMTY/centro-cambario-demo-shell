/** How one shade of a brand scale moves away from the 500 base, in OKLCH. */
export interface AjusteTono {
  /** Toward the light or the dark end; null for the base itself. */
  hacia: 'claro' | 'oscuro' | null;
  /** Share of the distance to that end (0…1). */
  t: number;
  /** Share of the base's chroma kept. */
  croma: number;
}

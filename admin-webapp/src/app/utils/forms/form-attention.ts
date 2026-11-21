import { FormGroup } from '@angular/forms';
import { ControlNegocio } from '@data/types/negocio.types';

/** How many controls of a negocio form are invalid. */
export function invalidFieldCount(form: FormGroup<Record<string, ControlNegocio>>): number {
  return Object.values(form.controls).filter((control) => control.invalid).length;
}

/** The action bar's line after a failed Guardar; null once nothing needs attention. */
export function attentionSummary(count: number): string | null {
  if (count <= 0) return null;
  return count === 1 ? 'Revise el campo marcado.' : `Revise los ${count} campos marcados.`;
}

/**
 * Moves focus to the first invalid field of a negocio form, in the form's order. The element is found
 * by the id `campo-negocio` gives its control (`<prefix>-<field id>`), so call it after the render
 * that draws the error lines (`afterNextRender`).
 */
export function focusFirstInvalid(
  form: FormGroup<Record<string, ControlNegocio>>,
  root: HTMLElement,
  prefix: string,
): void {
  const field = Object.keys(form.controls).find((key) => form.controls[key].invalid);
  if (!field) return;
  const element = root.querySelector<HTMLElement>(`#${CSS.escape(`${prefix}-${field}`)}`);
  if (!element) return;
  element.scrollIntoView({ block: 'center' });
  element.focus({ preventScroll: true });
}

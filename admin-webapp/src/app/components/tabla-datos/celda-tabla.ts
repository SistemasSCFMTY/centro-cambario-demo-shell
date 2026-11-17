import { Directive, inject, input, TemplateRef } from '@angular/core';
import { ContextoCeldaTabla } from '@data/interfaces/contexto-celda-tabla';

/**
 * Custom cell content for one column of `app-tabla-datos`, projected as a template; the row is the
 * implicit context. Without it the column shows its accessor value as text.
 * `<ng-template appCeldaTabla="folio" [filas]="filas()" let-fila>…</ng-template>`. `[filas]` is
 * the same array the table gets: it only exists so the compiler infers the row type and `let-fila`
 * is typed (never read at runtime). Buttons inside a cell stop the click from reaching the row:
 * `(click)="$event.stopPropagation()"`.
 */
@Directive({ selector: 'ng-template[appCeldaTabla]' })
export class CeldaTabla<T = unknown> {
  readonly plantilla = inject<TemplateRef<ContextoCeldaTabla<T>>>(TemplateRef);

  /** The column id. */
  readonly columna = input.required<string>({ alias: 'appCeldaTabla' });
  /** The table's rows, here only to type `let-fila`. */
  readonly filas = input.required<readonly T[]>();

  static ngTemplateContextGuard<T>(
    _directiva: CeldaTabla<T>,
    _contexto: unknown,
  ): _contexto is ContextoCeldaTabla<T> {
    return true;
  }
}

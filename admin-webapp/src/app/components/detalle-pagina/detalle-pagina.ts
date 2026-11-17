import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EncabezadoPagina } from '@components/encabezado-pagina/encabezado-pagina';
import { PestanaDetalle } from '@data/interfaces/pestana-detalle';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

/**
 * The shell of a detail page (plans/01 Detail views): one `panel` that opens with the page header
 * (back link, title, `[meta]` pill, `[linea]`, `[acciones]`), an optional `[banner]` and a tab bar
 * on a hairline. **Auditoría is always the last tab**: the shell appends it, and the page fills
 * it with `app-pestana-auditoria`. The page lists its own tabs and draws the body of the active
 * one (`@switch (pestana())`) as the shell's content. Set `claveUrl` (`tab`) to keep the active
 * tab in the URL.
 *
 * Slots: `[meta]` (status pills beside the title), `[linea]` (one line under the description,
 * e.g. what the cliente can do; the element brings its own spacing), `[banner]` (a full-width callout between the header and the
 * tabs, e.g. a blocking estatus; the element brings its own `px-8 pb-6 empty:hidden`) and `[acciones]` (header buttons).
 *
 * **Projection rule:** a slot's content must sit directly under a top-level element of the
 * shell's content (`<ng-container meta>…</ng-container>`, `<p linea>`), never inside an `@if` or
 * `@for`: Angular only projects the root nodes of the content, and a slot attribute on a node
 * nested in a control-flow block is not projected (NG8011). Put the `@if` inside the slotted
 * element instead, and give the element `empty:hidden` styling when it can end up empty.
 */
@Component({
  selector: 'app-detalle-pagina',
  imports: [EncabezadoPagina, HlmTabsImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalle-pagina.html',
  host: { class: 'block' },
})
export class DetallePagina {
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);

  readonly titulo = input.required<string>();
  readonly descripcion = input<string>();
  readonly volverA = input<readonly string[] | null>(null);
  /** Query params of the back link. */
  readonly volverParametros = input<Params | null>(null);
  readonly etiquetaVolver = input('Volver');
  /** The page's own tabs; Auditoría is added after them. */
  readonly pestanas = input<readonly PestanaDetalle[]>([{ id: 'general', etiqueta: 'General' }]);
  /** Query param that keeps the active tab (`tab`). Without it the tab is only in memory. */
  readonly claveUrl = input<string | null>(null);
  /** Draws the page's shape as skeletons instead of the content. */
  readonly cargando = input(false);
  readonly etiquetaCarga = input('Cargando');

  /** The active tab id. Bind it two-way and branch the body on it. */
  readonly pestana = model<string>();

  private readonly parametros = toSignal(this.ruta.queryParamMap, {
    initialValue: this.ruta.snapshot.queryParamMap,
  });

  protected readonly todas = computed<readonly PestanaDetalle[]>(() => [
    ...this.pestanas().filter((p) => p.id !== 'auditoria'),
    { id: 'auditoria', etiqueta: 'Auditoría' },
  ]);

  protected readonly activa = computed(() => {
    const ids = this.todas().map((p) => p.id);
    const deseada = this.claveUrl() ? this.parametros().get(this.claveUrl()!) : this.pestana();
    return deseada && ids.includes(deseada) ? deseada : ids[0];
  });

  protected readonly esqueletoCampos = [1, 2, 3, 4];

  constructor() {
    effect(() => {
      const activa = this.activa();
      untracked(() => {
        if (this.pestana() !== activa) this.pestana.set(activa);
      });
    });
  }

  protected seleccionar(id: string): void {
    const clave = this.claveUrl();
    if (clave) {
      this.router.navigate([], {
        relativeTo: this.ruta,
        queryParams: { [clave]: id },
        queryParamsHandling: 'merge',
      });
    } else {
      this.pestana.set(id);
    }
  }
}

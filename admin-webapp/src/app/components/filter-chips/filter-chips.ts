import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ListaUrl } from '@components/lista-url/lista-url';
import { DefinicionFiltro } from '@data/interfaces/definicion-filtro';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { formatearFecha } from '@utils/fechas/fechas';

/**
 * The active filters of a list as removable chips, under the view tabs (plans/01 List behaviors):
 * what the popover's count badge stands for, in words, with «Limpiar filtros» after them. Reads and
 * writes the page's `ListaUrl`; draws nothing while no popover filter is set.
 */
@Component({
  selector: 'app-filter-chips',
  imports: [NgIcon],
  providers: [provideIcons({ lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-chips.html',
  host: { class: 'block empty:hidden' },
})
export class FilterChips {
  private readonly list = inject(ListaUrl);

  readonly filters = input.required<readonly DefinicionFiltro[]>();
  /** Draws its own top hairline; off at the top of a tab panel that already has one. */
  readonly separated = input(true);

  protected readonly chips = computed(() => {
    const values = this.list.estado().filtros;
    return this.filters()
      .filter((f) => !f.soloUrl && values[f.id])
      .map((filter) => {
        const value = values[filter.id];
        const text =
          filter.tipo === 'seleccion'
            ? (filter.opciones?.find((o) => o.valor === value)?.etiqueta ?? value)
            : filter.tipo === 'fecha'
              ? formatearFecha(value)
              : value;
        return { id: filter.id, label: filter.etiqueta, text };
      });
  });

  protected remove(id: string): void {
    const rest = { ...this.list.estado().filtros };
    delete rest[id];
    this.list.aplicarFiltros(rest);
  }

  protected clear(): void {
    this.list.limpiarFiltros();
  }
}

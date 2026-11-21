import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DateField } from '@components/date-field/date-field';
import { ListaUrl } from '@components/lista-url/lista-url';
import { DefinicionFiltro } from '@data/interfaces/definicion-filtro';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideListFilter } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSelectImports } from '@spartan-ng/helm/select';

/**
 * The `Filtros` trigger and its popover (plans/01 List behaviors): a filter icon with the count of
 * active filters, placed left of the page's primary action. The page provides `ListaUrl`; the
 * active count and `Limpiar` come from the URL, `Aplicar` writes the draft back to it. Selection
 * filters use Spartan's select, dates the shared date field; the rest are native inputs. `soloUrl` filters (view tabs) don't appear here.
 */
@Component({
  selector: 'app-filtros-popover',
  imports: [DateField, HlmButtonImports, HlmInput, HlmPopoverImports, HlmSelectImports, NgIcon],
  providers: [provideIcons({ lucideListFilter })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filtros-popover.html',
})
export class FiltrosPopover {
  private readonly lista = inject(ListaUrl);

  readonly filtros = input.required<readonly DefinicionFiltro[]>();

  protected readonly estado = signal<'open' | 'closed'>('closed');
  /** The values being edited; they reach the URL on `Aplicar`. */
  protected readonly borrador = signal<Record<string, string>>({});

  protected readonly activos = this.lista.filtrosActivos;

  protected readonly visibles = computed(() => this.filtros().filter((f) => !f.soloUrl));

  /** Per selection filter: the label its trigger shows for a stored value. */
  protected readonly etiquetas = computed(() => {
    const porFiltro: Record<string, (valor: string) => string> = {};
    for (const filtro of this.filtros()) {
      const etiquetas = new Map((filtro.opciones ?? []).map((o) => [o.valor, o.etiqueta]));
      porFiltro[filtro.id] = (valor) => etiquetas.get(valor) ?? valor;
    }
    return porFiltro;
  });

  protected alCambiarEstado(estado: 'open' | 'closed'): void {
    this.estado.set(estado);
    if (estado === 'open') this.borrador.set({ ...this.lista.estado().filtros });
  }

  protected escribir(id: string, evento: Event): void {
    const valor = (evento.target as HTMLInputElement | HTMLSelectElement).value;
    this.borrador.update((actual) => ({ ...actual, [id]: valor }));
  }

  protected escribirValor(id: string, valor: string | null | undefined): void {
    this.borrador.update((actual) => ({ ...actual, [id]: valor ?? '' }));
  }

  protected aplicar(evento: Event): void {
    evento.preventDefault();
    this.lista.aplicarFiltros(this.borrador());
    this.estado.set('closed');
  }

  protected limpiar(): void {
    this.lista.limpiarFiltros();
    this.borrador.set({});
    this.estado.set('closed');
  }
}

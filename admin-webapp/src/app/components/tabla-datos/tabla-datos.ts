import { ListaUrl } from '@components/lista-url/lista-url';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { DesvanecidoDesplazamiento } from '@components/desvanecido-desplazamiento/desvanecido-desplazamiento';
import { CeldaTabla } from '@components/tabla-datos/celda-tabla';
import {
  ALTO_ENCABEZADO_TABLA_REM,
  ALTO_FILA_REM,
  FILAS_ESQUELETO,
  TAMANO_PAGINA_INICIAL,
  TAMANOS_PAGINA,
} from '@data/constants/lista.constants';
import { OrdenLista } from '@data/interfaces/orden-lista';
import { AltoFila, ColumnaTabla } from '@data/types/tabla.types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideArrowUp,
  lucideChevronLeft,
  lucideChevronRight,
  lucideChevronsUpDown,
  lucideInbox,
} from '@ng-icons/lucide';
import { injectTable, RowData } from '@tanstack/angular-table';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { paginaMaxima } from '@utils/lista/estado-lista';
import { CARACTERISTICAS_TABLA } from '@utils/tabla/caracteristicas-tabla';
import { paginasVisibles } from '@utils/tabla/paginas-visibles';

/**
 * The paged, sortable table of every list page (plans/01 Tables): Spartan's table over TanStack,
 * with `manualPagination` + `manualSorting`, so TanStack only holds the UI state and the API does
 * the work. It is controlled: feed it the current page (`filas`, `total`, `pagina`, `tamano`,
 * `orden`) and react to `paginaCambia`, `tamanoCambia` and `ordenCambia`, usually by writing them
 * to `ListaUrl`. Column headers must be strings; cells with custom content are
 * `<ng-template appCeldaTabla="id" let-fila>`. Keep `columnas` stable (a component property), never
 * rebuilt on each change detection.
 */
@Component({
  selector: 'app-tabla-datos',
  imports: [
    DesvanecidoDesplazamiento,
    HlmButtonImports,
    HlmSelectImports,
    HlmTableImports,
    NgTemplateOutlet,
    NgIcon,
  ],
  providers: [
    provideIcons({
      lucideArrowDown,
      lucideArrowUp,
      lucideChevronLeft,
      lucideChevronRight,
      lucideChevronsUpDown,
      lucideInbox,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabla-datos.html',
  host: { class: 'block' },
})
export class TablaDatos<T extends RowData> {
  private static siguienteId = 0;

  readonly columnas = input.required<ColumnaTabla<T>[]>();
  readonly filas = input.required<readonly T[]>();
  /** The accessible name of the table. */
  readonly titulo = input.required<string>();
  /** Rows behind the filters, across all pages. */
  readonly total = input(0);
  readonly cargando = input(false);
  /** 1-based. */
  readonly pagina = input(1);
  readonly tamano = input(TAMANO_PAGINA_INICIAL);
  readonly tamanos = input<readonly number[]>(TAMANOS_PAGINA);
  readonly orden = input<OrdenLista | null>(null);
  /** The page's default order (`esquema.ordenInicial`): its column flips direction, never drops. */
  readonly ordenInicial = input<OrdenLista | null>(null);
  /** Column ids the API can sort by (`esquema.ordenables`); any other header draws no sort button. */
  readonly ordenables = input<readonly string[]>([]);
  /** `alta` for rows with an avatar or a two-line cell. */
  readonly alto = input<AltoFila>('compacta');
  /** The whole row opens the detail. */
  readonly filaClicable = input(true);
  /** Label of the trailing `.row-action` (the keyboard path into the row). `null` draws none. */
  readonly etiquetaAccion = input<string | null>('Ver detalle');
  /** Row property whose text completes the action label («Ver detalle de OP-…»). */
  readonly campoEtiquetaAccion = input<string | null>(null);
  readonly vacioTitulo = input('No hay registros');
  readonly vacioDescripcion = input('Cuando haya información, aparecerá aquí.');
  /** The page shows a load error above the table: no empty state then, and no height floor. */
  readonly error = input(false);

  readonly paginaCambia = output<number>();
  readonly tamanoCambia = output<number>();
  /** `null` once a third click on the same (non-default) column goes back to the default order. */
  readonly ordenCambia = output<OrdenLista | null>();
  readonly filaClic = output<T>();

  /** The list page's URL state, when there is one: the empty state offers «Limpiar filtros». */
  private readonly listState = inject(ListaUrl, { optional: true });

  private readonly celdas = contentChildren(CeldaTabla);

  private readonly estadoOrden = computed(() => {
    const orden = this.orden();
    return orden ? [{ id: orden.columna, desc: orden.direccion === 'desc' }] : [];
  });

  private readonly plantillas = computed(
    () =>
      new Map<string, TemplateRef<unknown>>(
        this.celdas().map((c) => [c.columna(), c.plantilla as TemplateRef<unknown>]),
      ),
  );

  private readonly tabla = injectTable<typeof CARACTERISTICAS_TABLA, T>(() => ({
    features: CARACTERISTICAS_TABLA,
    columns: this.columnas(),
    data: this.filas() as T[],
    manualPagination: true,
    manualSorting: true,
    rowCount: this.total(),
    state: {
      sorting: this.estadoOrden(),
      pagination: { pageIndex: this.pagina() - 1, pageSize: this.tamano() },
    },
  }));

  protected readonly encabezados = computed(() => {
    const orden = this.orden();
    return this.tabla.getHeaderGroups()[0].headers.map((encabezado) => {
      const definicion = encabezado.column.columnDef;
      const ordenable =
        encabezado.column.getCanSort() && this.ordenables().includes(encabezado.column.id);
      const direccion = orden?.columna === encabezado.column.id ? orden.direccion : null;
      return {
        id: encabezado.id,
        columna: encabezado.column.id,
        etiqueta: typeof definicion.header === 'string' ? definicion.header : encabezado.column.id,
        numerica: !!definicion.meta?.numerica,
        oculto: !!definicion.meta?.encabezadoOculto,
        pinned: !!definicion.meta?.pinned,
        ordenable,
        direccion,
        ariaOrden: direccion === 'asc' ? 'ascending' : direccion === 'desc' ? 'descending' : 'none',
      };
    });
  });

  protected readonly filasVista = computed(() => {
    const plantillas = this.plantillas();
    // Rows depend on the data signal even when TanStack memoizes the model.
    this.filas();
    const campo = this.campoEtiquetaAccion();
    const accion = this.etiquetaAccion();
    return this.tabla.getRowModel().rows.map((fila) => {
      const referencia = campo ? (fila.original as Record<string, unknown>)[campo] : null;
      return {
        id: fila.id,
        original: fila.original,
        etiquetaAccion: referencia ? `${accion} de ${String(referencia)}` : accion,
        celdas: fila.getAllCells().map((celda) => {
          const valor = celda.getValue();
          return {
            id: celda.id,
            numerica: !!celda.column.columnDef.meta?.numerica,
            pinned: !!celda.column.columnDef.meta?.pinned,
            plantilla: plantillas.get(celda.column.id) ?? null,
            texto: valor === null || valor === undefined || valor === '' ? '—' : String(valor),
          };
        }),
      };
    });
  });

  protected readonly esqueleto = computed(() => this.cargando() && this.filas().length === 0);
  protected readonly refrescando = computed(() => this.cargando() && this.filas().length > 0);
  protected readonly vacia = computed(
    () => !this.cargando() && !this.error() && this.filas().length === 0,
  );
  protected readonly hasFilters = computed(() => (this.listState?.filtrosActivos() ?? 0) > 0);

  /**
   * What a screen reader hears after each load: the range, or the empty state when nothing
   * matched. It stays mounted (the paginator unmounts at zero rows), so «no results» is announced.
   */
  protected readonly announcement = computed(() => {
    if (this.cargando() || this.error()) return '';
    return this.total() > 0 ? this.rango() : `${this.vacioTitulo()}. ${this.vacioDescripcion()}`;
  });

  protected readonly columnasEsqueleto = computed(() =>
    Array.from({ length: this.columnas().length + (this.etiquetaAccion() ? 1 : 0) }, (_, i) => i),
  );
  protected readonly columnasTotales = computed(
    () => this.columnas().length + (this.etiquetaAccion() ? 1 : 0),
  );

  /** Skeleton rows only carry the height: they never react to the pointer. */
  protected readonly claseEsqueleto = computed(() => (this.alto() === 'alta' ? 'h-14' : 'h-10'));

  protected readonly claseFila = computed(() => {
    const alto = this.claseEsqueleto();
    return this.filaClicable()
      ? `${alto} group cursor-pointer hover:bg-primary-50 active:bg-primary-100 dark:hover:bg-panel-muted dark:active:bg-surface-700`
      : `${alto} hover:bg-transparent`;
  });

  /** A pinned cell paints its own fill, so it follows the row's hover and press colors. */
  protected readonly pinnedCellClass = computed(() =>
    this.filaClicable()
      ? 'bg-panel transition-colors duration-100 group-hover:bg-primary-50 group-active:bg-primary-100 dark:group-hover:bg-panel-muted dark:group-active:bg-surface-700'
      : 'bg-panel',
  );

  /** A floor, not a fixed height: a full page keeps the paginator from jumping. */
  protected readonly alturaMinimaRem = computed(() =>
    this.error() ? 0 : this.tamano() * ALTO_FILA_REM[this.alto()] + ALTO_ENCABEZADO_TABLA_REM,
  );

  protected readonly paginasTotales = computed(() => paginaMaxima(this.total(), this.tamano()));
  protected readonly botonesPagina = computed(() =>
    paginasVisibles(this.pagina(), this.paginasTotales()),
  );
  protected readonly rango = computed(() => {
    const total = this.total();
    if (total === 0) return '0 registros';
    const desde = (this.pagina() - 1) * this.tamano() + 1;
    const hasta = Math.min(total, this.pagina() * this.tamano());
    return `${desde}–${hasta} de ${total}`;
  });

  protected readonly filasEsqueleto = Array.from({ length: FILAS_ESQUELETO }, (_, i) => i);
  protected readonly idTamano = `tamano-pagina-${TablaDatos.siguienteId++}`;

  protected alternarOrden(columna: string): void {
    const actual = this.orden();
    if (actual?.columna !== columna) {
      this.ordenCambia.emit({ columna, direccion: 'asc' });
      return;
    }
    const esInicial = this.ordenInicial()?.columna === columna;
    if (actual.direccion === 'asc') this.ordenCambia.emit({ columna, direccion: 'desc' });
    else if (esInicial) this.ordenCambia.emit({ columna, direccion: 'asc' });
    else this.ordenCambia.emit(null);
  }

  protected clearFilters(): void {
    this.listState?.limpiarFiltros();
  }

  protected cambiarTamano(tamano: number | null | undefined): void {
    if (tamano !== null && tamano !== undefined) this.tamanoCambia.emit(tamano);
  }
}

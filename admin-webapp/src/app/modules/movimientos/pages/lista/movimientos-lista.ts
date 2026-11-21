import { FilterChips } from '@components/filter-chips/filter-chips';
import { ErrorNotice } from '@components/error-notice/error-notice';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import { CeldaPrincipal } from '@components/celda-principal/celda-principal';
import { EncabezadoPagina } from '@components/encabezado-pagina/encabezado-pagina';
import { FiltrosPopover } from '@components/filtros-popover/filtros-popover';
import { ListaUrl } from '@components/lista-url/lista-url';
import { PillEstatus } from '@components/pill-estatus/pill-estatus';
import { CeldaTabla } from '@components/tabla-datos/celda-tabla';
import { TablaDatos } from '@components/tabla-datos/tabla-datos';
import {
  ESQUEMA_MOVIMIENTOS,
  ETIQUETA_CLASE_MOVIMIENTO,
  ICONO_CLASE_MOVIMIENTO,
  PILL_ESTATUS_MOVIMIENTO,
  VISTAS_MOVIMIENTOS,
} from '@data/constants/movimientos.constants';
import { MovimientoListaDto } from '@data/dto/movimientos.dto';
import { EsquemaLista } from '@data/interfaces/esquema-lista';
import { ColumnaTabla } from '@data/types/tabla.types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload } from '@ng-icons/lucide';
import { select, Store } from '@ngxs/store';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { FechaHoraPipe } from '@pipes/fecha-hora.pipe';
import { MontoPipe } from '@pipes/monto.pipe';
import {
  CargarMovimientos,
  CargarSucursalesMovimientos,
  ExportarMovimientos,
} from '@store/movimientos/actions/movimientos.actions';
import { MovimientosState } from '@store/movimientos/state/movimientos.state';
import { consultaDeEstado } from '@utils/lista/consulta-lista';

/** `/movimientos`: traspasos, traslados de valores and dotaciones, with filters, totals and export. */
@Component({
  selector: 'app-movimientos-lista',
  imports: [
    ErrorNotice,
    CeldaPrincipal,
    CeldaTabla,
    FilterChips,
    EncabezadoPagina,
    FechaHoraPipe,
    FiltrosPopover,
    HlmButtonImports,
    HlmSpinner,
    HlmTabsImports,
    MontoPipe,
    NgIcon,
    PillEstatus,
    TablaDatos,
  ],
  providers: [ListaUrl, provideIcons({ lucideDownload })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movimientos-lista.html',
})
export class MovimientosLista {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  protected readonly lista = inject(ListaUrl);

  protected readonly pagina = select(MovimientosState.pagina);
  protected readonly sucursales = select(MovimientosState.sucursales);
  protected readonly cargando = select(MovimientosState.cargandoLista);
  protected readonly exportando = select(MovimientosState.exportando);
  protected readonly error = select(MovimientosState.errorLista);

  /** The base schema with the sucursal options once the catalog arrives. */
  protected readonly esquema = computed<EsquemaLista>(() => {
    const sucursales = this.sucursales();
    return {
      ...ESQUEMA_MOVIMIENTOS,
      filtros: ESQUEMA_MOVIMIENTOS.filtros.map((filtro) =>
        filtro.id === 'sucursal' && sucursales.length > 0
          ? { ...filtro, opciones: sucursales.map((s) => ({ valor: s.id, etiqueta: s.nombre })) }
          : filtro,
      ),
    };
  });
  protected readonly filas = computed(() => this.pagina()?.filas ?? []);
  protected readonly total = computed(() => this.pagina()?.total ?? 0);
  protected readonly totales = computed(() => this.pagina()?.totales ?? []);
  protected readonly vistaActual = computed(() => this.lista.estado().filtros['vista'] ?? 'todos');

  protected readonly vistas = VISTAS_MOVIMIENTOS;
  protected readonly etiquetaClase = ETIQUETA_CLASE_MOVIMIENTO;
  protected readonly iconoClase = ICONO_CLASE_MOVIMIENTO;
  protected readonly pillEstatus = PILL_ESTATUS_MOVIMIENTO;
  protected readonly columnas: ColumnaTabla<MovimientoListaDto>[] = [
    { accessorKey: 'folio', header: 'Folio', meta: { pinned: true } },
    { accessorKey: 'estatus', header: 'Estatus' },
    { accessorKey: 'fecha', header: 'Fecha' },
    { accessorKey: 'origen', header: 'Origen' },
    { accessorKey: 'destino', header: 'Destino' },
    { id: 'montos', header: 'Montos', meta: { numerica: true } },
    { id: 'resolvio', header: 'Resolvió' },
  ];

  constructor() {
    this.store.dispatch(new CargarSucursalesMovimientos());
    effect(() => this.lista.iniciar(this.esquema()));
    effect(() => {
      if (!this.lista.esquema()) return;
      const consulta = consultaDeEstado(this.lista.estado());
      untracked(() => this.store.dispatch(new CargarMovimientos(consulta)));
    });
    effect(() => {
      const pagina = this.pagina();
      if (pagina) untracked(() => this.lista.ajustarPagina(pagina.total));
    });
  }

  protected cambiarVista(vista: string): void {
    this.lista.establecerFiltro('vista', vista === 'todos' ? null : vista);
  }

  protected abrir(movimiento: MovimientoListaDto): void {
    this.router.navigate(['/movimientos', movimiento.id], { state: this.lista.backState() });
  }

  protected exportar(): void {
    this.store.dispatch(new ExportarMovimientos(consultaDeEstado(this.lista.estado())));
  }

  protected retry(): void {
    this.store.dispatch(new CargarMovimientos(consultaDeEstado(this.lista.estado())));
  }
}

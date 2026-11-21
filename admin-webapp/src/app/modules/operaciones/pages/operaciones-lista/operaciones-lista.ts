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
import { Router, RouterLink } from '@angular/router';
import { CeldaTabla } from '@components/tabla-datos/celda-tabla';
import { EncabezadoPagina } from '@components/encabezado-pagina/encabezado-pagina';
import { FiltrosPopover } from '@components/filtros-popover/filtros-popover';
import { ListaUrl } from '@components/lista-url/lista-url';
import { PillEstatus } from '@components/pill-estatus/pill-estatus';
import { TablaDatos } from '@components/tabla-datos/tabla-datos';
import { ETIQUETA_INSTRUMENTO, ETIQUETA_TIPO_OPERACION } from '@data/constants/dominio.constants';
import { PILL_ESTATUS_OPERACION, PILL_RELEVANTE } from '@data/constants/estatus.constants';
import { TAMANO_PAGINA_INICIAL, TAMANOS_PAGINA } from '@data/constants/lista.constants';
import {
  COLUMNAS_OPERACIONES,
  FILTRO_CAJERO_OPERACIONES,
  FILTRO_DIVISA_OPERACIONES,
  FILTRO_SUCURSAL_OPERACIONES,
  FILTROS_FINALES_OPERACIONES,
  FILTROS_INICIALES_OPERACIONES,
  ORDEN_INICIAL_OPERACIONES,
  ORDENABLES_OPERACIONES,
  PESTANAS_VISTA_OPERACIONES,
  TEXTO_VACIO_CON_FILTROS_OPERACIONES,
  TEXTO_VACIO_OPERACIONES,
  VISTA_INICIAL_OPERACIONES,
} from '@data/constants/operaciones.constants';
import { OperacionListaDto } from '@data/dto/operaciones.dto';
import { DefinicionFiltro } from '@data/interfaces/definicion-filtro';
import { EsquemaLista } from '@data/interfaces/esquema-lista';
import { OrdenLista } from '@data/interfaces/orden-lista';
import { VistaOperaciones } from '@data/types/vista-operaciones.types';
import { select, Store } from '@ngxs/store';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { FechaHoraPipe } from '@pipes/fecha-hora.pipe';
import { MontoPipe } from '@pipes/monto.pipe';
import { NumeroPipe } from '@pipes/numero.pipe';
import {
  CargarCatalogosOperaciones,
  CargarOperaciones,
} from '@store/operaciones/actions/operaciones.actions';
import { OperacionesState } from '@store/operaciones/state/operaciones.state';
import { consultaDeEstado } from '@utils/lista/consulta-lista';

/**
 * `/operaciones`: every compra and venta of every sucursal, read-only. The view tabs, filters, sort
 * and page live in the URL (`ListaUrl`); the page loads only from that state.
 */
@Component({
  selector: 'app-operaciones-lista',
  imports: [
    ErrorNotice,
    CeldaTabla,
    FilterChips,
    EncabezadoPagina,
    FechaHoraPipe,
    FiltrosPopover,
    HlmTabsImports,
    MontoPipe,
    NumeroPipe,
    PillEstatus,
    RouterLink,
    TablaDatos,
  ],
  providers: [ListaUrl],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './operaciones-lista.html',
})
export class OperacionesLista {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  protected readonly lista = inject(ListaUrl);

  protected readonly pagina = select(OperacionesState.pagina);
  protected readonly cargando = select(OperacionesState.cargando);
  protected readonly error = select(OperacionesState.error);
  private readonly sucursales = select(OperacionesState.sucursales);
  private readonly cajeros = select(OperacionesState.cajeros);
  private readonly divisas = select(OperacionesState.divisas);

  protected readonly filas = computed(() => this.pagina()?.filas ?? []);

  protected readonly filtros = computed<readonly DefinicionFiltro[]>(() => {
    const sucursales = this.sucursales();
    const cajeros = this.cajeros();
    const divisas = this.divisas();
    return [
      ...FILTROS_INICIALES_OPERACIONES,
      {
        ...FILTRO_SUCURSAL_OPERACIONES,
        opciones: sucursales.length
          ? sucursales.map((s) => ({ valor: s.id, etiqueta: s.nombre }))
          : undefined,
      },
      {
        ...FILTRO_CAJERO_OPERACIONES,
        opciones: cajeros.length
          ? cajeros.map((c) => ({ valor: c.id, etiqueta: c.nombreCompleto }))
          : undefined,
      },
      {
        ...FILTRO_DIVISA_OPERACIONES,
        opciones: divisas.length
          ? divisas.map((d) => ({ valor: d.clave, etiqueta: `${d.clave} · ${d.nombre}` }))
          : undefined,
      },
      ...FILTROS_FINALES_OPERACIONES,
    ];
  });

  private readonly esquema = computed<EsquemaLista>(() => ({
    tamanos: TAMANOS_PAGINA,
    tamanoInicial: TAMANO_PAGINA_INICIAL,
    ordenables: ORDENABLES_OPERACIONES,
    ordenInicial: ORDEN_INICIAL_OPERACIONES,
    filtros: this.filtros(),
  }));

  protected readonly vista = computed<VistaOperaciones>(
    () => (this.lista.estado().filtros['vista'] as VistaOperaciones) ?? VISTA_INICIAL_OPERACIONES,
  );
  protected readonly textoVacio = computed(() =>
    this.lista.filtrosActivos()
      ? TEXTO_VACIO_CON_FILTROS_OPERACIONES
      : TEXTO_VACIO_OPERACIONES[this.vista()],
  );

  protected readonly columnas = COLUMNAS_OPERACIONES;
  protected readonly pestanasVista = PESTANAS_VISTA_OPERACIONES;
  protected readonly ordenables = ORDENABLES_OPERACIONES;
  protected readonly ordenInicial = ORDEN_INICIAL_OPERACIONES;
  protected readonly pillEstatus = PILL_ESTATUS_OPERACION;
  protected readonly pillRelevante = PILL_RELEVANTE;
  protected readonly etiquetaTipo = ETIQUETA_TIPO_OPERACION;
  protected readonly etiquetaInstrumento = ETIQUETA_INSTRUMENTO;

  constructor() {
    this.store.dispatch(new CargarCatalogosOperaciones());

    effect(() => this.lista.iniciar(this.esquema()));

    effect(() => {
      this.lista.estado();
      untracked(() => this.cargar());
    });

    effect(() => {
      const pagina = this.pagina();
      if (pagina && !this.cargando()) untracked(() => this.lista.ajustarPagina(pagina.total));
    });
  }

  protected cambiarVista(vista: string): void {
    this.lista.establecerFiltro('vista', vista);
  }

  protected ordenar(orden: OrdenLista | null): void {
    this.lista.ordenar(orden);
  }

  protected abrir(fila: OperacionListaDto): void {
    this.router.navigate(['/operaciones', fila.id], { state: this.lista.backState() });
  }

  protected retry(): void {
    this.cargar();
  }

  private cargar(): void {
    const estado = this.lista.estado();
    const filtros = { vista: VISTA_INICIAL_OPERACIONES, ...estado.filtros };
    this.store.dispatch(new CargarOperaciones(consultaDeEstado({ ...estado, filtros })));
  }
}

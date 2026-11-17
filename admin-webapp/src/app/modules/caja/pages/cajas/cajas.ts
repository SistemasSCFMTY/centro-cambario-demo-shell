import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CeldaPrincipal } from '@components/celda-principal/celda-principal';
import { EncabezadoPagina } from '@components/encabezado-pagina/encabezado-pagina';
import { FiltrosPopover } from '@components/filtros-popover/filtros-popover';
import { ListaUrl } from '@components/lista-url/lista-url';
import { PillEstatus } from '@components/pill-estatus/pill-estatus';
import { CeldaTabla } from '@components/tabla-datos/celda-tabla';
import { TablaDatos } from '@components/tabla-datos/tabla-datos';
import { DIVISAS_CAJA, ESQUEMA_CAJAS } from '@data/constants/caja.constants';
import { PILL_ESTATUS_CAJA } from '@data/constants/estatus.constants';
import { CajaFilaDto, TotalDivisaDto } from '@data/dto/caja-pagina.dto';
import { EsquemaLista } from '@data/interfaces/esquema-lista';
import { ColumnaTabla } from '@data/types/tabla.types';
import { provideIcons } from '@ng-icons/core';
import { lucideBanknote, lucideVault } from '@ng-icons/lucide';
import { Store } from '@ngxs/store';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { FechaHoraPipe } from '@pipes/fecha-hora.pipe';
import { NumeroPipe } from '@pipes/numero.pipe';
import { CargarCajas, CargarSucursalesCaja } from '@store/caja/actions/caja.actions';
import { CajaState } from '@store/caja/state/caja.state';
import { formatearNumero } from '@utils/dinero/formato-dinero';
import { consultaDeEstado } from '@utils/lista/consulta-lista';

/**
 * `/caja`: every drawer and vault of every sucursal with its estatus, responsable and balance per
 * currency (plans/02, read-only). The demo has no detail for a caja, so rows don't open anything.
 */
@Component({
  selector: 'app-cajas',
  imports: [
    CeldaPrincipal,
    CeldaTabla,
    EncabezadoPagina,
    FechaHoraPipe,
    FiltrosPopover,
    HlmButtonImports,
    NumeroPipe,
    PillEstatus,
    RouterLink,
    TablaDatos,
  ],
  providers: [ListaUrl, provideIcons({ lucideBanknote, lucideVault })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cajas.html',
  host: { class: 'block' },
})
export class Cajas {
  private readonly store = inject(Store);
  protected readonly lista = inject(ListaUrl);

  protected readonly pagina = this.store.selectSignal(CajaState.cajas);
  protected readonly sucursales = this.store.selectSignal(CajaState.sucursales);
  protected readonly cargando = this.store.selectSignal(CajaState.cargandoCajas);
  protected readonly error = this.store.selectSignal(CajaState.errorCajas);

  protected readonly esquema = computed<EsquemaLista>(() => {
    const sucursales = this.sucursales();
    return {
      ...ESQUEMA_CAJAS,
      filtros: ESQUEMA_CAJAS.filtros.map((filtro) =>
        filtro.id === 'sucursal' && sucursales.length > 0
          ? { ...filtro, opciones: sucursales.map((s) => ({ valor: s.id, etiqueta: s.nombre })) }
          : filtro,
      ),
    };
  });
  protected readonly filas = computed(() => this.pagina()?.filas ?? []);
  protected readonly total = computed(() => this.pagina()?.total ?? 0);
  protected readonly totales = computed(() => this.pagina()?.totales ?? []);

  protected readonly pillEstatus = PILL_ESTATUS_CAJA;
  protected readonly divisas = DIVISAS_CAJA;
  /** Same request while the filters, page and sort don't change, so the catalog arriving doesn't reload the list. */
  private readonly consulta = computed(() => consultaDeEstado(this.lista.estado()), {
    equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });
  /** One balance column per currency; the decimals come from the catalog through the totals. */
  protected readonly decimales = computed(
    () =>
      Object.fromEntries(
        this.totales().map((total: TotalDivisaDto) => [total.divisa, total.decimales]),
      ) as Record<string, number>,
  );
  protected readonly columnas = computed<ColumnaTabla<CajaFilaDto>[]>(() => {
    const decimales = this.decimales();
    return [
      { id: 'caja', header: 'Caja', accessorFn: (fila) => fila.nombre },
      { id: 'estatus', header: 'Estatus', accessorFn: (fila) => fila.estatus },
      ...DIVISAS_CAJA.map((divisa): ColumnaTabla<CajaFilaDto> => ({
        id: divisa,
        header: divisa,
        accessorFn: (fila) => formatearNumero(fila.saldos[divisa], decimales[divisa] ?? 2),
        meta: { numerica: true },
      })),
    ];
  });

  constructor() {
    this.lista.iniciar(this.esquema());
    this.store.dispatch(new CargarSucursalesCaja());
    effect(() => this.lista.iniciar(this.esquema()));
    effect(() => {
      const consulta = this.consulta();
      untracked(() => this.store.dispatch(new CargarCajas(consulta)));
    });
    effect(() => {
      const pagina = this.pagina();
      if (pagina && !this.cargando()) untracked(() => this.lista.ajustarPagina(pagina.total));
    });
  }
}

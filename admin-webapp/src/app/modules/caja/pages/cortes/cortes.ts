import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { CeldaPrincipal } from '@components/celda-principal/celda-principal';
import { EncabezadoPagina } from '@components/encabezado-pagina/encabezado-pagina';
import { FiltrosPopover } from '@components/filtros-popover/filtros-popover';
import { ListaUrl } from '@components/lista-url/lista-url';
import { PillEstatus } from '@components/pill-estatus/pill-estatus';
import { CeldaTabla } from '@components/tabla-datos/celda-tabla';
import { TablaDatos } from '@components/tabla-datos/tabla-datos';
import { ESQUEMA_CONTEOS, NOTA_CONTEOS, PILL_TIPO_CONTEO } from '@data/constants/caja.constants';
import { ConteoFilaDto } from '@data/dto/caja-pagina.dto';
import { AjustePill } from '@data/interfaces/ajuste-pill';
import { EsquemaLista } from '@data/interfaces/esquema-lista';
import { ColumnaTabla } from '@data/types/tabla.types';
import { FechaHoraPipe } from '@pipes/fecha-hora.pipe';
import { NumeroPipe } from '@pipes/numero.pipe';
import { provideIcons } from '@ng-icons/core';
import { lucideVault } from '@ng-icons/lucide';
import { Store } from '@ngxs/store';
import { CargarConteos, CargarOpcionesCajas } from '@store/caja/actions/caja.actions';
import { CajaState } from '@store/caja/state/caja.state';
import { formatearFechaHora } from '@utils/fechas/fechas';
import { formatearNumero } from '@utils/dinero/formato-dinero';
import { consultaDeEstado } from '@utils/lista/consulta-lista';

/**
 * `/caja/cortes`: the history of aperturas, arqueos and cortes with what the system said, what was
 * counted and the difference per currency (plans/02, read-only). The demo has no detail for a
 * conteo, so the list carries everything.
 */
@Component({
  selector: 'app-cortes',
  imports: [
    CeldaPrincipal,
    CeldaTabla,
    EncabezadoPagina,
    FechaHoraPipe,
    FiltrosPopover,
    NumeroPipe,
    PillEstatus,
    TablaDatos,
  ],
  providers: [ListaUrl, provideIcons({ lucideVault })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cortes.html',
  host: { class: 'block' },
})
export class Cortes {
  private readonly store = inject(Store);
  protected readonly lista = inject(ListaUrl);

  protected readonly pagina = this.store.selectSignal(CajaState.conteos);
  protected readonly opcionesCajas = this.store.selectSignal(CajaState.opcionesCajas);
  protected readonly cargando = this.store.selectSignal(CajaState.cargandoConteos);
  protected readonly error = this.store.selectSignal(CajaState.errorConteos);

  protected readonly esquema = computed<EsquemaLista>(() => {
    const opciones = this.opcionesCajas();
    return {
      ...ESQUEMA_CONTEOS,
      filtros: ESQUEMA_CONTEOS.filtros.map((filtro) =>
        filtro.id === 'caja' && opciones.length > 0 ? { ...filtro, opciones } : filtro,
      ),
    };
  });
  protected readonly filas = computed(() => this.pagina()?.filas ?? []);
  protected readonly total = computed(() => this.pagina()?.total ?? 0);
  /** Sobrante and faltante per currency in the filter, as pills. */
  protected readonly pillsDiferencias = computed<AjustePill[]>(() => {
    const pills: AjustePill[] = [];
    for (const d of this.pagina()?.diferencias ?? []) {
      if (d.faltante) {
        pills.push({
          tono: 'danger',
          etiqueta: `Faltante ${d.divisa} ${formatearNumero(d.faltante, d.decimales)}`,
        });
      }
      if (d.sobrante) {
        pills.push({
          tono: 'success',
          etiqueta: `Sobrante ${d.divisa} ${formatearNumero(d.sobrante, d.decimales)}`,
        });
      }
    }
    return pills;
  });
  protected readonly nota = NOTA_CONTEOS;
  /** Same request while the filters, page and sort don't change, so the catalog arriving doesn't reload the list. */
  private readonly consulta = computed(() => consultaDeEstado(this.lista.estado()), {
    equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });

  protected readonly pillTipo = PILL_TIPO_CONTEO;
  protected readonly columnas: ColumnaTabla<ConteoFilaDto>[] = [
    {
      id: 'fecha',
      header: 'Fecha',
      accessorFn: (fila) => formatearFechaHora(fila.realizadoEn),
    },
    { id: 'tipo', header: 'Tipo', accessorFn: (fila) => fila.tipo },
    { id: 'caja', header: 'Caja', accessorFn: (fila) => fila.caja },
    { id: 'responsable', header: 'Responsable', accessorKey: 'responsable' },
    { id: 'conteo', header: 'Sistema → contado (diferencia)', accessorFn: () => '' },
    { id: 'observaciones', header: 'Observaciones', accessorKey: 'observaciones' },
  ];

  constructor() {
    this.lista.iniciar(this.esquema());
    this.store.dispatch(new CargarOpcionesCajas());
    effect(() => this.lista.iniciar(this.esquema()));
    effect(() => {
      const consulta = this.consulta();
      untracked(() => this.store.dispatch(new CargarConteos(consulta)));
    });
    effect(() => {
      const pagina = this.pagina();
      if (pagina && !this.cargando()) untracked(() => this.lista.ajustarPagina(pagina.total));
    });
  }
}

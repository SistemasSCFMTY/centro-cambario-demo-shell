import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DetallePagina } from '@components/detalle-pagina/detalle-pagina';
import { FiltrosPopover } from '@components/filtros-popover/filtros-popover';
import { ListaUrl } from '@components/lista-url/lista-url';
import { PestanaAuditoria } from '@components/pestana-auditoria/pestana-auditoria';
import {
  CLAVE_URL_PESTANA_NEGOCIO,
  ESQUEMA_SUCURSALES,
  OPCIONES_FILTRO_AUDITORIA,
  PESTANAS_NEGOCIO,
} from '@data/constants/negocio.constants';
import { FiltroAuditoriaNegocio } from '@data/types/negocio.types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePencil, lucidePlus } from '@ng-icons/lucide';
import { Store } from '@ngxs/store';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NegocioGeneral } from '@modules/negocio/components/negocio-general/negocio-general';
import { NegocioLegal } from '@modules/negocio/components/negocio-legal/negocio-legal';
import { NegocioSucursales } from '@modules/negocio/components/negocio-sucursales/negocio-sucursales';
import {
  CargarAuditoriaNegocio,
  CargarNegocio,
  CargarOpcionesNegocio,
} from '@store/negocio/actions/negocio.actions';
import { NegocioState } from '@store/negocio/state/negocio.state';

/**
 * `/negocio`: the centro cambiario's profile (plans/04). Tabs General · Legal · Sucursales ·
 * Auditoría, the active one kept in `?tab=`. Editing is a form page (`/negocio/editar`,
 * `/negocio/sucursales/...`); this page only reads.
 */
@Component({
  selector: 'app-negocio',
  imports: [
    DetallePagina,
    FiltrosPopover,
    HlmButtonImports,
    NegocioGeneral,
    NegocioLegal,
    NegocioSucursales,
    NgIcon,
    PestanaAuditoria,
    RouterLink,
  ],
  providers: [ListaUrl, provideIcons({ lucidePencil, lucidePlus })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './negocio.html',
})
export class PaginaNegocio {
  private readonly store = inject(Store);
  private readonly lista = inject(ListaUrl);

  protected readonly pestana = signal<string | undefined>(undefined);
  protected readonly filtroAuditoria = signal<FiltroAuditoriaNegocio>('todos');

  protected readonly perfil = this.store.selectSignal(NegocioState.perfil);
  protected readonly opciones = this.store.selectSignal(NegocioState.opciones);
  protected readonly cargando = this.store.selectSignal(NegocioState.cargando);
  protected readonly error = this.store.selectSignal(NegocioState.errorPerfil);
  protected readonly errorAuditoria = this.store.selectSignal(NegocioState.errorAuditoria);
  protected readonly auditoria = this.store.selectSignal(NegocioState.auditoria);
  protected readonly cargandoAuditoria = this.store.selectSignal(NegocioState.cargandoAuditoria);

  protected readonly descripcion = computed(() => this.perfil()?.centro.nombreComercial);
  protected readonly registrosAuditoria = computed(() => {
    const filtro = this.filtroAuditoria();
    return filtro === 'todos'
      ? this.auditoria()
      : this.auditoria().filter((a) => a.entidad === filtro);
  });

  protected readonly pestanas = PESTANAS_NEGOCIO;
  protected readonly claveUrl = CLAVE_URL_PESTANA_NEGOCIO;
  protected readonly filtros = ESQUEMA_SUCURSALES.filtros;
  protected readonly opcionesAuditoria = OPCIONES_FILTRO_AUDITORIA;

  constructor() {
    this.lista.iniciar(ESQUEMA_SUCURSALES);
    this.store.dispatch([new CargarNegocio(), new CargarOpcionesNegocio()]);
    effect(() => {
      if (this.pestana() === 'auditoria') {
        untracked(() => this.store.dispatch(new CargarAuditoriaNegocio()));
      }
    });
  }

  protected filtrarAuditoria(filtro: FiltroAuditoriaNegocio): void {
    this.filtroAuditoria.set(filtro);
  }
}

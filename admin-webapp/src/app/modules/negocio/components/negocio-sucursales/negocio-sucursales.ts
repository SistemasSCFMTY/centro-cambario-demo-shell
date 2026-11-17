import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CeldaPrincipal } from '@components/celda-principal/celda-principal';
import { ListaUrl } from '@components/lista-url/lista-url';
import { PillEstatus } from '@components/pill-estatus/pill-estatus';
import { CeldaTabla } from '@components/tabla-datos/celda-tabla';
import { TablaDatos } from '@components/tabla-datos/tabla-datos';
import { PILL_ESTATUS_SUCURSAL } from '@data/constants/estatus.constants';
import { ESQUEMA_SUCURSALES, NOTA_SUCURSALES_REPORTES } from '@data/constants/negocio.constants';
import { AjustePill } from '@data/interfaces/ajuste-pill';
import { DomicilioPipe } from '@pipes/domicilio.pipe';
import { SucursalResumen } from '@data/interfaces/sucursal-resumen-negocio';
import { ColumnaTabla } from '@data/types/tabla.types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBan, lucidePencil, lucideRotateCcw } from '@ng-icons/lucide';
import { Store } from '@ngxs/store';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import {
  CambiarEstatusSucursal,
  CargarSucursales,
  LimpiarErrorGuardadoNegocio,
} from '@store/negocio/actions/negocio.actions';
import { NegocioState } from '@store/negocio/state/negocio.state';
import { consultaDeEstado } from '@utils/lista/consulta-lista';

/**
 * The Sucursales tab (plans/04): a paged table with the filters in the page header's popover.
 * The row opens the sucursal's form; baja and reactivación ask for a confirmation first. It reads
 * the `ListaUrl` the page provides, so the tab's filters, page and sort live in the URL.
 */
@Component({
  selector: 'app-negocio-sucursales',
  imports: [
    CeldaPrincipal,
    CeldaTabla,
    DomicilioPipe,
    HlmButtonImports,
    HlmDialogImports,
    HlmSpinner,
    NgIcon,
    PillEstatus,
    RouterLink,
    TablaDatos,
  ],
  providers: [provideIcons({ lucideBan, lucidePencil, lucideRotateCcw })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './negocio-sucursales.html',
  host: { class: 'block' },
})
export class NegocioSucursales {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  protected readonly lista = inject(ListaUrl);

  /** The sucursal the dialog is about; kept until the next one so the dialog doesn't empty while it closes. */
  protected readonly confirmando = signal<SucursalResumen | null>(null);
  protected readonly dialogoAbierto = signal(false);

  protected readonly pagina = this.store.selectSignal(NegocioState.sucursales);
  protected readonly cargando = this.store.selectSignal(NegocioState.cargandoSucursales);
  protected readonly guardando = this.store.selectSignal(NegocioState.guardando);
  protected readonly error = this.store.selectSignal(NegocioState.errorSucursales);
  protected readonly errorGuardado = this.store.selectSignal(NegocioState.errorGuardado);

  protected readonly filas = computed(() => this.pagina()?.filas ?? []);
  protected readonly hayFiltros = computed(() => this.lista.filtrosActivos() > 0);
  protected readonly estadoDialogo = computed(() => (this.dialogoAbierto() ? 'open' : 'closed'));

  protected readonly esquema = ESQUEMA_SUCURSALES;
  protected readonly nota = NOTA_SUCURSALES_REPORTES;
  protected readonly pillEstatus = PILL_ESTATUS_SUCURSAL;
  protected readonly pillFalta: AjustePill = { tono: 'warning', etiqueta: 'Falta' };
  protected readonly columnas: ColumnaTabla<SucursalResumen>[] = [
    { accessorKey: 'clave', header: 'Clave' },
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'codigoPostal', header: 'Código postal' },
    { accessorKey: 'localidad', header: 'Localidad' },
    { id: 'domicilio', header: 'Domicilio' },
    { accessorKey: 'usuarios', header: 'Usuarios', meta: { numerica: true } },
    { accessorKey: 'operaciones', header: 'Operaciones', meta: { numerica: true } },
    { accessorKey: 'estatus', header: 'Estatus' },
    { id: 'acciones', header: 'Acciones', meta: { encabezadoOculto: true } },
  ];

  constructor() {
    effect(() => {
      const consulta = consultaDeEstado(this.lista.estado());
      untracked(() => this.store.dispatch(new CargarSucursales(consulta)));
    });
    effect(() => {
      const pagina = this.pagina();
      if (pagina) untracked(() => this.lista.ajustarPagina(pagina.total));
    });
  }

  protected editar(sucursal: SucursalResumen): void {
    this.router.navigate(['/negocio/sucursales', sucursal.id, 'editar']);
  }

  protected pedirConfirmacion(sucursal: SucursalResumen): void {
    this.store.dispatch(new LimpiarErrorGuardadoNegocio());
    this.confirmando.set(sucursal);
    this.dialogoAbierto.set(true);
  }

  protected alCambiarEstado(estado: 'open' | 'closed'): void {
    this.dialogoAbierto.set(estado === 'open');
  }

  protected confirmar(): void {
    const sucursal = this.confirmando();
    if (!sucursal) return;
    this.store
      .dispatch(new CambiarEstatusSucursal(sucursal.id, sucursal.estatus === 'BAJA'))
      .subscribe(() => {
        if (this.store.selectSnapshot(NegocioState.errorGuardado)) return;
        this.dialogoAbierto.set(false);
        this.store.dispatch(new CargarSucursales(consultaDeEstado(this.lista.estado())));
      });
  }
}

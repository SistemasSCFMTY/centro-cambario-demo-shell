import { Location } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BarraAcciones } from '@components/barra-acciones/barra-acciones';
import { EncabezadoPagina } from '@components/encabezado-pagina/encabezado-pagina';
import { ErrorNotice } from '@components/error-notice/error-notice';
import {
  PARAMETROS_VOLVER_SUCURSALES,
  SECCIONES_FORMULARIO_SUCURSAL,
  SUCURSAL_VACIA,
} from '@data/constants/negocio.constants';
import { DatosSucursal } from '@data/interfaces/datos-sucursal-negocio';
import { OpcionesFormularioNegocio } from '@data/interfaces/opciones-formulario-negocio';
import { ControlNegocio } from '@data/types/negocio.types';
import { SucursalResumen } from '@data/interfaces/sucursal-resumen-negocio';
import { DiscardChangesDialog } from '@modules/negocio/components/discard-changes-dialog/discard-changes-dialog';
import { enlazarCatalogosDomicilio } from '@modules/negocio/helpers/catalogos-domicilio';
import {
  attentionSummary,
  focusFirstInvalid,
  invalidFieldCount,
} from '@utils/forms/form-attention';
import { backLinkParams } from '@utils/navigation/back-link';
import { validadoresDeCampo } from '@utils/negocio/validadores-campo';
import { SeccionNegocio } from '@modules/negocio/components/seccion-negocio/seccion-negocio';
import { Store } from '@ngxs/store';
import {
  CargarOpcionesNegocio,
  CargarSucursal,
  GuardarSucursal,
  LimpiarErrorGuardadoNegocio,
} from '@store/negocio/actions/negocio.actions';
import { NegocioState } from '@store/negocio/state/negocio.state';

/** `/negocio/sucursales/nueva` and `/negocio/sucursales/:id/editar`: the sucursal form page. */
@Component({
  selector: 'app-sucursal-formulario',
  imports: [BarraAcciones, DiscardChangesDialog, EncabezadoPagina, ErrorNotice, SeccionNegocio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sucursal-formulario.html',
})
export class SucursalFormulario {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly destruccion = inject(DestroyRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  protected readonly formulario = new FormGroup<Record<string, ControlNegocio>>({});

  protected readonly intentado = signal(false);
  protected readonly listo = signal(false);
  private readonly invalidCount = signal(0);
  protected readonly discardOpen = signal(false);

  private readonly opcionesBase = this.store.selectSignal(NegocioState.opciones);
  private readonly municipios = this.store.selectSignal(NegocioState.municipios);
  private readonly localidades = this.store.selectSignal(NegocioState.localidades);
  protected readonly sucursal = this.store.selectSignal(NegocioState.sucursal);
  protected readonly guardando = this.store.selectSignal(NegocioState.guardando);
  protected readonly cargandoGeografia = this.store.selectSignal(NegocioState.cargandoGeografia);
  protected readonly errorGeografia = this.store.selectSignal(NegocioState.errorGeografia);
  protected readonly errorGuardado = this.store.selectSignal(NegocioState.errorGuardado);
  protected readonly errorCarga = this.store.selectSignal(NegocioState.errorSucursal);

  protected readonly opciones = computed<OpcionesFormularioNegocio | null>(() => {
    const base = this.opcionesBase();
    return base
      ? { ...base, municipios: this.municipios(), localidades: this.localidades() }
      : null;
  });

  protected readonly titulo = computed(() => (this.id ? 'Editar sucursal' : 'Nueva sucursal'));
  protected readonly descripcion = computed(() => {
    const sucursal = this.sucursal();
    return this.id && sucursal ? `${sucursal.clave} · ${sucursal.nombre}` : 'Alta de una sucursal.';
  });
  /** The bar's single alert after a failed Guardar. */
  protected readonly attentionMessage = computed(() =>
    this.intentado() ? attentionSummary(this.invalidCount()) : null,
  );

  /** The sucursal being corrected; null for an alta. */
  protected readonly id = this.ruta.snapshot.paramMap.get('id');
  protected readonly secciones = SECCIONES_FORMULARIO_SUCURSAL;
  protected readonly volverParametros = PARAMETROS_VOLVER_SUCURSALES;
  protected readonly fieldPrefix = 'sucursal';

  constructor() {
    this.store.dispatch([new LimpiarErrorGuardadoNegocio(), new CargarOpcionesNegocio()]);
    if (this.id) this.store.dispatch(new CargarSucursal(this.id));
    for (const campo of this.secciones.flatMap((seccion) => seccion.campos)) {
      this.formulario.addControl(
        campo.id,
        new FormControl<string | string[]>('', {
          nonNullable: true,
          validators: validadoresDeCampo(campo),
        }),
      );
    }
    enlazarCatalogosDomicilio(this.formulario, this.store, this.destruccion, () => this.listo());
    this.formulario.statusChanges.pipe(takeUntilDestroyed()).subscribe((estado) => {
      this.invalidCount.set(invalidFieldCount(this.formulario));
      if (estado === 'VALID') this.intentado.set(false);
    });
    effect(() => {
      const sucursal = this.sucursal();
      if (!this.id || sucursal) untracked(() => this.rellenar(this.id ? sucursal : null));
    });
  }

  protected retryLoad(): void {
    this.store.dispatch(new CargarOpcionesNegocio());
    if (this.id) this.store.dispatch(new CargarSucursal(this.id));
  }

  /** Leaves at once when nothing was edited; otherwise asks first. */
  protected cancelar(): void {
    if (this.formulario.dirty) this.discardOpen.set(true);
    else this.volver();
  }

  protected guardar(): void {
    if (this.formulario.invalid) {
      this.intentado.set(true);
      this.invalidCount.set(invalidFieldCount(this.formulario));
      this.formulario.markAllAsTouched();
      afterNextRender(
        () => focusFirstInvalid(this.formulario, this.host.nativeElement, this.fieldPrefix),
        { injector: this.injector },
      );
      return;
    }
    this.store.dispatch(new GuardarSucursal(this.datos(), this.id)).subscribe(() => {
      if (!this.store.selectSnapshot(NegocioState.errorGuardado)) this.volver();
    });
  }

  /** Back to the Sucursales tab, with its filters when the form was opened from it. */
  protected volver(): void {
    const queryParams = backLinkParams(
      this.location.getState(),
      '/negocio',
      PARAMETROS_VOLVER_SUCURSALES,
    );
    this.router.navigate(['/negocio'], { queryParams });
  }

  private rellenar(sucursal: SucursalResumen | null): void {
    if (this.listo()) return;
    const origen: Record<string, unknown> = { ...(sucursal ?? SUCURSAL_VACIA) };
    for (const [campo, control] of Object.entries(this.formulario.controls)) {
      control.setValue(String(origen[campo] ?? ''));
    }
    this.formulario.markAsPristine();
    this.listo.set(true);
  }

  private datos(): DatosSucursal {
    const valores: Record<string, string> = {};
    for (const [campo, control] of Object.entries(this.formulario.controls)) {
      valores[campo] = String(control.value).trim();
    }
    return valores as unknown as DatosSucursal;
  }
}

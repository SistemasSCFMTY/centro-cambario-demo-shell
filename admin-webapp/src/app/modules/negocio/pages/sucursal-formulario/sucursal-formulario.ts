import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BarraAcciones } from '@components/barra-acciones/barra-acciones';
import { EncabezadoPagina } from '@components/encabezado-pagina/encabezado-pagina';
import {
  PARAMETROS_VOLVER_SUCURSALES,
  SECCIONES_FORMULARIO_SUCURSAL,
  SUCURSAL_VACIA,
} from '@data/constants/negocio.constants';
import { DatosSucursal } from '@data/interfaces/datos-sucursal-negocio';
import { OpcionesFormularioNegocio } from '@data/interfaces/opciones-formulario-negocio';
import { ControlNegocio } from '@data/types/negocio.types';
import { SucursalResumen } from '@data/interfaces/sucursal-resumen-negocio';
import { enlazarCatalogosDomicilio } from '@modules/negocio/helpers/catalogos-domicilio';
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
  imports: [BarraAcciones, EncabezadoPagina, SeccionNegocio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sucursal-formulario.html',
})
export class SucursalFormulario {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);
  private readonly destruccion = inject(DestroyRef);

  protected readonly formulario = new FormGroup<Record<string, ControlNegocio>>({});

  protected readonly intentado = signal(false);
  protected readonly listo = signal(false);

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

  /** The sucursal being corrected; null for an alta. */
  protected readonly id = this.ruta.snapshot.paramMap.get('id');
  protected readonly secciones = SECCIONES_FORMULARIO_SUCURSAL;
  protected readonly volverParametros = PARAMETROS_VOLVER_SUCURSALES;

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
      if (estado === 'VALID') this.intentado.set(false);
    });
    effect(() => {
      const sucursal = this.sucursal();
      if (!this.id || sucursal) untracked(() => this.rellenar(this.id ? sucursal : null));
    });
  }

  protected cancelar(): void {
    this.volver();
  }

  protected guardar(): void {
    if (this.formulario.invalid) {
      this.intentado.set(true);
      this.formulario.markAllAsTouched();
      return;
    }
    this.store.dispatch(new GuardarSucursal(this.datos(), this.id)).subscribe(() => {
      if (!this.store.selectSnapshot(NegocioState.errorGuardado)) this.volver();
    });
  }

  private volver(): void {
    this.router.navigate(['/negocio'], { queryParams: PARAMETROS_VOLVER_SUCURSALES });
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

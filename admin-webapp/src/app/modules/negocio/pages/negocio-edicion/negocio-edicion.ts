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
import { Router } from '@angular/router';
import { BarraAcciones } from '@components/barra-acciones/barra-acciones';
import { EncabezadoPagina } from '@components/encabezado-pagina/encabezado-pagina';
import { SECCIONES_FORMULARIO_NEGOCIO } from '@data/constants/negocio.constants';
import { GuardarNegocioDto } from '@data/dto/negocio-guardar.dto';
import { CampoFormulario } from '@data/interfaces/campo-formulario-negocio';
import { CentroCambiario } from '@data/interfaces/centro-cambiario';
import { OpcionesFormularioNegocio } from '@data/interfaces/opciones-formulario-negocio';
import { DatosLegales } from '@data/interfaces/datos-legales-negocio';
import { ControlNegocio } from '@data/types/negocio.types';
import { enlazarCatalogosDomicilio } from '@modules/negocio/helpers/catalogos-domicilio';
import { validadoresDeCampo } from '@utils/negocio/validadores-campo';
import { SeccionNegocio } from '@modules/negocio/components/seccion-negocio/seccion-negocio';
import { Store } from '@ngxs/store';
import {
  CargarNegocio,
  CargarOpcionesNegocio,
  GuardarNegocio,
  LimpiarErrorGuardadoNegocio,
} from '@store/negocio/actions/negocio.actions';
import { NegocioState } from '@store/negocio/state/negocio.state';
import { formatearMonto } from '@utils/dinero/formato-dinero';

/** `/negocio/editar`: one form page for the General and Legal data, saved from the sticky action bar. */
@Component({
  selector: 'app-negocio-edicion',
  imports: [BarraAcciones, EncabezadoPagina, SeccionNegocio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './negocio-edicion.html',
})
export class NegocioEdicion {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly destruccion = inject(DestroyRef);

  protected readonly formulario = new FormGroup<Record<string, ControlNegocio>>({});

  protected readonly intentado = signal(false);
  protected readonly listo = signal(false);

  protected readonly perfil = this.store.selectSignal(NegocioState.perfil);
  private readonly opcionesBase = this.store.selectSignal(NegocioState.opciones);
  private readonly municipios = this.store.selectSignal(NegocioState.municipios);
  private readonly localidades = this.store.selectSignal(NegocioState.localidades);
  protected readonly guardando = this.store.selectSignal(NegocioState.guardando);
  protected readonly cargandoGeografia = this.store.selectSignal(NegocioState.cargandoGeografia);
  protected readonly errorGeografia = this.store.selectSignal(NegocioState.errorGeografia);
  protected readonly errorGuardado = this.store.selectSignal(NegocioState.errorGuardado);
  protected readonly error = this.store.selectSignal(NegocioState.errorPerfil);

  protected readonly opciones = computed<OpcionesFormularioNegocio | null>(() => {
    const base = this.opcionesBase();
    return base
      ? { ...base, municipios: this.municipios(), localidades: this.localidades() }
      : null;
  });

  protected readonly limiteDiario = computed(() =>
    formatearMonto(this.perfil()?.centro.limiteDiarioUsd, 'USD'),
  );

  protected readonly secciones = SECCIONES_FORMULARIO_NEGOCIO;

  constructor() {
    this.store.dispatch([
      new LimpiarErrorGuardadoNegocio(),
      new CargarNegocio(),
      new CargarOpcionesNegocio(),
    ]);
    this.construirFormulario();
    enlazarCatalogosDomicilio(this.formulario, this.store, this.destruccion, () => this.listo());
    this.formulario.statusChanges.pipe(takeUntilDestroyed()).subscribe((estado) => {
      if (estado === 'VALID') this.intentado.set(false);
    });
    effect(() => {
      const perfil = this.perfil();
      if (perfil && !untracked(() => this.listo())) {
        untracked(() => this.rellenar(perfil.centro, perfil.legal));
      }
    });
  }

  protected cancelar(): void {
    this.router.navigate(['/negocio']);
  }

  protected guardar(): void {
    if (this.formulario.invalid) {
      this.intentado.set(true);
      this.formulario.markAllAsTouched();
      return;
    }
    this.store.dispatch(new GuardarNegocio(this.datos())).subscribe(() => {
      if (!this.store.selectSnapshot(NegocioState.errorGuardado))
        this.router.navigate(['/negocio']);
    });
  }

  private construirFormulario(): void {
    const campos = this.secciones.flatMap((seccion) => seccion.campos);
    for (const campo of campos) {
      this.formulario.addControl(
        campo.id,
        new FormControl<string | string[]>(campo.tipo === 'divisas' ? [] : '', {
          nonNullable: true,
          validators: validadoresDeCampo(campo),
        }),
      );
    }
    for (const campo of campos.filter((c) => c.noAnteriorA)) {
      this.formulario.controls[campo.noAnteriorA!].valueChanges
        .pipe(takeUntilDestroyed(this.destruccion))
        .subscribe(() => this.formulario.controls[campo.id].updateValueAndValidity());
    }
  }

  private rellenar(centro: CentroCambiario, legal: DatosLegales): void {
    const origen: Record<string, Record<string, unknown>> = {
      centro: { ...centro },
      legal: { ...legal },
    };
    for (const campo of this.secciones.flatMap((seccion) => seccion.campos)) {
      const valor = origen[campo.destino ?? 'centro'][campo.id];
      this.formulario.controls[campo.id].setValue(
        Array.isArray(valor) ? [...valor] : String(valor ?? ''),
      );
    }
    this.formulario.markAsPristine();
    this.listo.set(true);
  }

  /** The form's values laid over the current profile and legal data, so a field the form lacks is kept. */
  private datos(): GuardarNegocioDto {
    const actual = this.perfil();
    const centro: Record<string, unknown> = { ...actual?.centro };
    const legal: Record<string, unknown> = { ...actual?.legal };
    for (const campo of this.secciones.flatMap((seccion) => seccion.campos)) {
      const destino = campo.destino === 'legal' ? legal : centro;
      destino[campo.id] = this.valorDe(campo, this.formulario.controls[campo.id].value);
    }
    return {
      centro: { ...actual?.centro, ...centro } as CentroCambiario,
      legal: { ...actual?.legal, ...legal } as DatosLegales,
    };
  }

  private valorDe(campo: CampoFormulario, valor: string | string[]): string | string[] | null {
    if (Array.isArray(valor)) return valor;
    const limpio = valor.trim();
    const normalizado = campo.mayusculas ? limpio.toUpperCase() : limpio;
    return normalizado === '' && campo.nulable ? null : normalizado;
  }
}

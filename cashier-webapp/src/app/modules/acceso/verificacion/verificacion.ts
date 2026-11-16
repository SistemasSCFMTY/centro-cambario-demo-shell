import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { select, Store } from '@ngxs/store';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputOtpImports } from '@spartan-ng/helm/input-otp';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import {
  CancelarVerificacion,
  LimpiarErrorAutenticacion,
  ReenviarCodigo,
  VerificarCodigo,
} from '@store/autenticacion/actions/autenticacion.actions';
import { AutenticacionState } from '@store/autenticacion/state/autenticacion.state';
import { SesionState } from '@store/sesion/state/sesion.state';

/** Step 2: the one-time code sent to the usuario's email, with resend after a wait. */
@Component({
  selector: 'app-verificacion',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    HlmButtonImports,
    HlmInputOtpImports,
    HlmSpinnerImports,
  ],
  providers: [provideIcons({ lucideArrowLeft })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './verificacion.html',
})
export class Verificacion {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly formulario = inject(NonNullableFormBuilder).group({
    codigo: ['', Validators.required],
  });

  private readonly ahora = signal(Date.now());

  protected readonly reto = select(AutenticacionState.reto);
  protected readonly enviando = select(AutenticacionState.enviando);
  protected readonly reenviando = select(AutenticacionState.reenviando);
  protected readonly error = select(AutenticacionState.error);

  protected readonly segundosParaReenviar = computed(() => {
    const reto = this.reto();
    return reto ? Math.max(0, Math.ceil((reto.reenvioDisponibleEn - this.ahora()) / 1000)) : 0;
  });

  protected readonly cuentaRegresiva = computed(() => {
    const s = this.segundosParaReenviar();
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  });

  protected readonly ranuras = computed(() =>
    Array.from({ length: this.reto()?.longitudCodigo ?? 0 }, (_, i) => i),
  );

  constructor() {
    const reloj = setInterval(() => this.ahora.set(Date.now()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(reloj));
    this.formulario.controls.codigo.valueChanges.subscribe(() =>
      this.store.dispatch(new LimpiarErrorAutenticacion()),
    );
  }

  protected verificar(): void {
    const codigo = this.formulario.controls.codigo.value;
    if (codigo.length !== this.reto()?.longitudCodigo || this.enviando()) return;
    this.store.dispatch(new VerificarCodigo(codigo)).subscribe(() => {
      if (this.store.selectSnapshot(SesionState.iniciada)) {
        this.router.navigate(['/inicio']);
      } else {
        this.formulario.controls.codigo.setValue('', { emitEvent: false });
      }
    });
  }

  protected reenviar(): void {
    this.store.dispatch(new ReenviarCodigo()).subscribe(() => {
      if (!this.store.selectSnapshot(AutenticacionState.error)) {
        this.formulario.controls.codigo.setValue('', { emitEvent: false });
        toast.success('Enviamos un código nuevo.');
      }
    });
  }

  protected cancelar(): void {
    this.store.dispatch(new CancelarVerificacion());
  }
}

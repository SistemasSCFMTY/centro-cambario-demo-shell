import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { select, Store } from '@ngxs/store';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import {
  IniciarSesion,
  LimpiarErrorAutenticacion,
} from '@store/autenticacion/actions/autenticacion.actions';
import { AutenticacionState } from '@store/autenticacion/state/autenticacion.state';

/** Step 1: email + password. A correct pair starts the OTP step. */
@Component({
  selector: 'app-inicio-sesion',
  imports: [
    ReactiveFormsModule,
    NgIcon,
    HlmButtonImports,
    HlmFieldImports,
    HlmInputImports,
    HlmSpinnerImports,
  ],
  providers: [provideIcons({ lucideEye, lucideEyeOff })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './inicio-sesion.html',
})
export class InicioSesion {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly formulario = inject(NonNullableFormBuilder).group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
  });

  protected readonly mostrarContrasena = signal(false);

  protected readonly enviando = select(AutenticacionState.enviando);
  protected readonly error = select(AutenticacionState.error);

  constructor() {
    this.formulario.valueChanges.subscribe(() =>
      this.store.dispatch(new LimpiarErrorAutenticacion()),
    );
  }

  protected alternarContrasena(): void {
    this.mostrarContrasena.update((visible) => !visible);
  }

  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.store.dispatch(new IniciarSesion(this.formulario.getRawValue())).subscribe(() => {
      if (this.store.selectSnapshot(AutenticacionState.reto)) {
        this.router.navigate(['/acceso/verificacion']);
      }
    });
  }
}

import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CampoFormulario } from '@data/interfaces/campo-formulario-negocio';
import { hoyIso } from '@utils/fechas/fechas';

/** The validators a field definition asks for, in the order the form reports them. */
export function validadoresDeCampo(campo: CampoFormulario): ValidatorFn[] {
  const validadores: ValidatorFn[] = [];
  if (campo.requerido) validadores.push(Validators.required);
  if (campo.maxLongitud) validadores.push(Validators.maxLength(campo.maxLongitud));
  if (campo.correo) validadores.push(Validators.email);
  const patron = campo.patron;
  if (patron) {
    validadores.push((control: AbstractControl): ValidationErrors | null => {
      const valor = String(control.value ?? '').trim();
      if (!valor) return null;
      return patron.test(campo.mayusculas ? valor.toUpperCase() : valor) ? null : { pattern: true };
    });
  }
  if (campo.noFutura) {
    validadores.push((control: AbstractControl): ValidationErrors | null =>
      control.value && String(control.value) > hoyIso() ? { noFutura: true } : null,
    );
  }
  const otro = campo.noAnteriorA;
  if (otro) {
    validadores.push((control: AbstractControl): ValidationErrors | null => {
      const referencia = control.parent?.get(otro)?.value;
      return control.value && referencia && String(control.value) < String(referencia)
        ? { anterior: true }
        : null;
    });
  }
  return validadores;
}

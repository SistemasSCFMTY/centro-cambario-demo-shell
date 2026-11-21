import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ControlNegocio } from '@data/types/negocio.types';
import { attentionSummary, invalidFieldCount } from './form-attention';

describe('form-attention', () => {
  it('counts the invalid controls of the form', () => {
    const form = new FormGroup<Record<string, ControlNegocio>>({
      nombre: new FormControl<string | string[]>('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      rfc: new FormControl<string | string[]>('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      correo: new FormControl<string | string[]>('a@b.mx', { nonNullable: true }),
    });
    expect(invalidFieldCount(form)).toBe(2);
    form.controls['nombre'].setValue('Centro');
    expect(invalidFieldCount(form)).toBe(1);
  });

  it('words the summary in singular and plural', () => {
    expect(attentionSummary(1)).toBe('Revise el campo marcado.');
    expect(attentionSummary(3)).toBe('Revise los 3 campos marcados.');
  });

  it('has no summary when nothing needs attention', () => {
    expect(attentionSummary(0)).toBeNull();
  });
});

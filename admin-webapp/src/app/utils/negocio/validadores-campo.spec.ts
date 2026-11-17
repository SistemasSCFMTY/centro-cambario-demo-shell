import { FormControl, FormGroup } from '@angular/forms';
import { CampoFormulario } from '@data/interfaces/campo-formulario-negocio';
import { sumarDias, hoyIso } from '@utils/fechas/fechas';
import { validadoresDeCampo } from '@utils/negocio/validadores-campo';

function control(campo: Partial<CampoFormulario>, valor: string): FormControl<string> {
  const definicion: CampoFormulario = { id: 'campo', etiqueta: 'Campo', tipo: 'texto', ...campo };
  return new FormControl(valor, { nonNullable: true, validators: validadoresDeCampo(definicion) });
}

describe('validadoresDeCampo', () => {
  it('asks for nothing when the field has no rules', () => {
    expect(control({}, '').valid).toBe(true);
  });

  it('requires a value', () => {
    expect(control({ requerido: true }, '').errors).toEqual({ required: true });
    expect(control({ requerido: true }, 'x').valid).toBe(true);
  });

  it('caps the length', () => {
    expect(control({ maxLongitud: 3 }, 'abcd').errors?.['maxlength']).toBeTruthy();
    expect(control({ maxLongitud: 3 }, 'abc').valid).toBe(true);
  });

  it('checks the email format', () => {
    expect(control({ correo: true }, 'sin-arroba').errors?.['email']).toBe(true);
    expect(control({ correo: true }, 'a@b.mx').valid).toBe(true);
  });

  it('matches the pattern, skipping an empty value', () => {
    expect(control({ patron: /^\d{5}$/ }, '123').errors).toEqual({ pattern: true });
    expect(control({ patron: /^\d{5}$/ }, '12345').valid).toBe(true);
    expect(control({ patron: /^\d{5}$/ }, '').valid).toBe(true);
  });

  it('uppercases before matching when the field is kept in uppercase', () => {
    const patron = /^[A-Z]{2}$/;
    expect(control({ patron }, 'ab').errors).toEqual({ pattern: true });
    expect(control({ patron, mayusculas: true }, 'ab').valid).toBe(true);
  });

  it('rejects a future date when it can not be future', () => {
    expect(control({ noFutura: true }, sumarDias(hoyIso(), 1)).errors).toEqual({ noFutura: true });
    expect(control({ noFutura: true }, hoyIso()).valid).toBe(true);
  });

  it('rejects a date before another field', () => {
    const campo: CampoFormulario = {
      id: 'hasta',
      etiqueta: 'Hasta',
      tipo: 'fecha',
      noAnteriorA: 'desde',
    };
    const hasta = new FormControl('2026-01-01', {
      nonNullable: true,
      validators: validadoresDeCampo(campo),
    });
    const grupo = new FormGroup({ desde: new FormControl('2026-02-01'), hasta });
    hasta.updateValueAndValidity();
    expect(hasta.errors).toEqual({ anterior: true });
    grupo.controls.desde.setValue('2025-12-01');
    hasta.updateValueAndValidity();
    expect(hasta.valid).toBe(true);
  });
});

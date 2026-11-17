import { DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { ControlNegocio } from '@data/types/negocio.types';
import { Store } from '@ngxs/store';
import {
  CargarLocalidadesNegocio,
  CargarMunicipiosNegocio,
} from '@store/negocio/actions/negocio.actions';

/**
 * Wires the form's entidad → municipio → localidad chain (plans/04): each change loads the options
 * of the next one through the store, and, once `listo` (the form is filled), a change by the user
 * clears the fields below it. The fields are looked up by their ids `entidad`, `municipio` and
 * `localidad`, so the form must declare them in that order.
 */
export function enlazarCatalogosDomicilio(
  formulario: FormGroup<Record<string, ControlNegocio>>,
  store: Store,
  destruccion: DestroyRef,
  listo: () => boolean,
): void {
  const { entidad, municipio, localidad } = formulario.controls;

  entidad.valueChanges.pipe(takeUntilDestroyed(destruccion)).subscribe((valor) => {
    store.dispatch(new CargarMunicipiosNegocio(String(valor)));
    if (listo()) municipio.setValue('');
  });

  municipio.valueChanges.pipe(takeUntilDestroyed(destruccion)).subscribe((valor) => {
    store.dispatch(new CargarLocalidadesNegocio(String(entidad.value), String(valor)));
    if (listo()) localidad.setValue('');
  });
}

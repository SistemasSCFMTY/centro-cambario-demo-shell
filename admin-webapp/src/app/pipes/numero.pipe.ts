import { Pipe, PipeTransform } from '@angular/core';
import { formatearNumero } from '@utils/dinero/formato-dinero';

/** `{{ 17.4 | appNumero: 4 }}` → `17.4000`; `—` when empty. */
@Pipe({ name: 'appNumero' })
export class NumeroPipe implements PipeTransform {
  transform(valor: number | null | undefined, decimales = 2): string {
    return formatearNumero(valor, decimales);
  }
}

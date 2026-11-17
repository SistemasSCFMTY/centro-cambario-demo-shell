import { Pipe, PipeTransform } from '@angular/core';
import { CodigoDivisa } from '@data/types/divisa.types';
import { formatearMonto } from '@utils/dinero/formato-dinero';

/** `{{ 1234.5 | appMonto: 'USD' }}` → `USD 1,234.50`; `—` when empty. */
@Pipe({ name: 'appMonto' })
export class MontoPipe implements PipeTransform {
  transform(valor: number | null | undefined, divisa: CodigoDivisa): string {
    return formatearMonto(valor, divisa);
  }
}

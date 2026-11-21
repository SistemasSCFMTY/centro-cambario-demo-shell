import { Pipe, PipeTransform } from '@angular/core';
import { CodigoDivisa } from '@data/types/divisa.types';
import { formatearMonto } from '@utils/dinero/formato-dinero';

/**
 * `{{ 1234.5 | appMonto: 'USD' }}` → `USD 1,234.50`; `{{ 3000 | appMonto: 'USD' : 0 }}` → `USD 3,000`;
 * `—` when empty. Every amount carries its ISO key, MXN included.
 */
@Pipe({ name: 'appMonto' })
export class MontoPipe implements PipeTransform {
  transform(valor: number | null | undefined, divisa: CodigoDivisa, decimals?: number): string {
    return formatearMonto(valor, divisa, decimals);
  }
}

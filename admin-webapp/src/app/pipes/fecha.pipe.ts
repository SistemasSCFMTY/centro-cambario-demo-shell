import { Pipe, PipeTransform } from '@angular/core';
import { formatearFecha } from '@utils/fechas/fechas';

/** `2026-11-16[T…]` → `16/11/2026`; `—` when empty. */
@Pipe({ name: 'appFecha' })
export class FechaPipe implements PipeTransform {
  transform(valor: string | null | undefined): string {
    return formatearFecha(valor);
  }
}

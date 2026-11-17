import { Pipe, PipeTransform } from '@angular/core';
import { formatearFechaHora } from '@utils/fechas/fechas';

/** `2026-11-16T09:30:00` → `16/11/2026 09:30`; `—` when empty. */
@Pipe({ name: 'appFechaHora' })
export class FechaHoraPipe implements PipeTransform {
  transform(valor: string | null | undefined): string {
    return formatearFechaHora(valor);
  }
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeftRight,
  lucideBanknote,
  lucideBuilding2,
  lucideTruck,
  lucideUsers,
} from '@ng-icons/lucide';
import { iniciales } from '@utils/texto/iniciales';

/**
 * The first cell of a row, by what the entity is (plans/01 Lead cell): people and companies get
 * initials in a round avatar; things get a photo or their own Lucide glyph on a tile, never initials.
 * Projected content (a pill) sits after the name.
 */
@Component({
  selector: 'app-celda-principal',
  imports: [NgIcon],
  providers: [
    provideIcons({
      lucideArrowLeftRight,
      lucideBanknote,
      lucideBuilding2,
      lucideTruck,
      lucideUsers,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './celda-principal.html',
  host: { class: 'block min-w-0' },
})
export class CeldaPrincipal {
  readonly nombre = input.required<string>();
  readonly detalle = input<string | null>(null);
  readonly tipo = input<'persona' | 'cosa'>('persona');
  /** For a thing without a photo: a Lucide icon registered by the page (the common ones are built in). */
  readonly icono = input('lucideBuilding2');
  readonly imagenUrl = input<string | null>(null);

  protected readonly siglas = computed(() => iniciales(this.nombre()));
}

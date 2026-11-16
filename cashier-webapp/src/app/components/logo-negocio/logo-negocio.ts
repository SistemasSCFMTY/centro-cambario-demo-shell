import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TamanoLogo } from '@data/types/logo.types';
import { select } from '@ngxs/store';
import { TemaState } from '@store/tema/state/tema.state';
import { iniciales } from '@utils/texto/iniciales';

/** The tenant's logo, or its initials on a flat brand tile while it has none. */
@Component({
  selector: 'app-logo-negocio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './logo-negocio.html',
  host: { class: 'inline-flex shrink-0' },
})
export class LogoNegocio {
  readonly tamano = input<TamanoLogo>('md');

  protected readonly marca = select(TemaState.marca);

  protected readonly iniciales = computed(() => iniciales(this.marca()?.nombre ?? ''));
  protected readonly clasesTamano = computed(() => this.clasesPorTamano[this.tamano()]);

  private readonly clasesPorTamano: Record<TamanoLogo, string> = {
    sm: 'size-8 rounded-sm text-footnote',
    md: 'size-10 rounded-md text-callout',
    lg: 'size-12 rounded-lg text-headline',
  };
}

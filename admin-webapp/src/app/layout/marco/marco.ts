import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LogoNegocio } from '@components/logo-negocio/logo-negocio';
import { BarraLateral } from '@layout/barra-lateral/barra-lateral';
import { SelectorModo } from '@layout/selector-modo/selector-modo';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu } from '@ng-icons/lucide';
import { select } from '@ngxs/store';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { TemaState } from '@store/tema/state/tema.state';
import { filter } from 'rxjs';

/**
 * The admin shell (plans/00 Visual direction, plans/05 Shell): exactly one screen tall. The Neuro
 * sidebar card stays put in both modes; a top bar holds the theme menu; only the content scrolls. The pane is silver metal in
 * light and flat Neuro dark in dark. Below lg the sidebar opens from a sheet.
 */
@Component({
  selector: 'app-marco',
  imports: [
    RouterOutlet,
    BarraLateral,
    SelectorModo,
    LogoNegocio,
    NgIcon,
    HlmButtonImports,
    HlmSheetImports,
  ],
  providers: [provideIcons({ lucideMenu })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './marco.html',
})
export class Marco {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly contenido = viewChild.required<ElementRef<HTMLElement>>('contenido');

  protected readonly nombreNegocio = select(TemaState.nombreNegocio);

  /** A new page starts at the top of the pane (the window never scrolls, so the router can't do it). */
  constructor() {
    const suscripcion = this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe(() => this.contenido().nativeElement.scrollTo({ top: 0 }));
    this.destroyRef.onDestroy(() => suscripcion.unsubscribe());
  }
}

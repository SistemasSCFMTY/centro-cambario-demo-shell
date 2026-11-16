import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BarraSuperior } from '@layout/barra-superior/barra-superior';
import { filter } from 'rxjs';

/**
 * The cashier shell (plans/00 cashier-webapp): exactly one screen tall. The Neuro top bar stays put
 * in both modes and the silver/dark pane takes the full width below it; only the content scrolls.
 */
@Component({
  selector: 'app-marco',
  imports: [RouterOutlet, BarraSuperior],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './marco.html',
})
export class Marco {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly contenido = viewChild.required<ElementRef<HTMLElement>>('contenido');

  /** A new page starts at the top of the pane (the window never scrolls, so the router can't do it). */
  constructor() {
    const suscripcion = this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe(() => this.contenido().nativeElement.scrollTo({ top: 0 }));
    this.destroyRef.onDestroy(() => suscripcion.unsubscribe());
  }
}

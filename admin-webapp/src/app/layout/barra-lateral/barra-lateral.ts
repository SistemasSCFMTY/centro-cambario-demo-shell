import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  output,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LogoNegocio } from '@components/logo-negocio/logo-negocio';
import { SelectorModo } from '@layout/selector-modo/selector-modo';
import { ICONOS_NAVEGACION, NAVEGACION } from '@data/constants/navegacion.constants';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronRight,
  lucideChevronsUpDown,
  lucideLogIn,
  lucideLogOut,
} from '@ng-icons/lucide';
import { select, Store } from '@ngxs/store';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { CerrarSesion } from '@store/sesion/actions/sesion.actions';
import { SesionState } from '@store/sesion/state/sesion.state';
import { TemaState } from '@store/tema/state/tema.state';
import { filter, map } from 'rxjs';

/**
 * The Neuro sidebar card: brand with the theme menu, module nav and usuario. Always rendered in a `.dark` scope. Labeled
 * groups collapse in place; the group holding the current page opens on its own.
 */
@Component({
  selector: 'app-barra-lateral',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIcon,
    LogoNegocio,
    SelectorModo,
    HlmDropdownMenuImports,
  ],
  providers: [
    provideIcons({
      ...ICONOS_NAVEGACION,
      lucideChevronRight,
      lucideChevronsUpDown,
      lucideLogIn,
      lucideLogOut,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './barra-lateral.html',
  host: { class: 'block h-full' },
})
export class BarraLateral {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  /** A nav link was followed (the mobile sheet closes on it). */
  readonly navego = output<void>();

  /** Labels of the groups the user has open. */
  protected readonly abiertos = signal<ReadonlySet<string>>(new Set());

  protected readonly nombreNegocio = select(TemaState.nombreNegocio);
  protected readonly usuario = select(SesionState.usuario);
  protected readonly nombreCompleto = select(SesionState.nombreCompleto);
  protected readonly iniciales = select(SesionState.iniciales);
  protected readonly etiquetaRol = select(SesionState.etiquetaRol);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((evento) => evento instanceof NavigationEnd),
      map((evento) => evento.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** Label of the group that holds the current page, if any. */
  protected readonly grupoActual = computed(() => {
    const ruta = this.url().split(/[/?#]/)[1];
    return (
      this.grupos.find((grupo) => grupo.elementos.some((elemento) => elemento.ruta === ruta))
        ?.etiqueta ?? null
    );
  });

  /** Open state by group label, for the template. */
  protected readonly abierto = computed(() => {
    const abiertos = this.abiertos();
    return Object.fromEntries(
      this.grupos.map((g) => [g.etiqueta ?? '', abiertos.has(g.etiqueta ?? '')]),
    );
  });

  private static instancias = 0;
  protected readonly grupos = NAVEGACION;
  /** Keeps the ids unique while the desktop sidebar and the mobile sheet are both rendered. */
  protected readonly prefijo = `nav-${BarraLateral.instancias++}`;

  /** Arriving at a page opens its group (a closed group never hides where you are). */
  constructor() {
    effect(() => {
      const grupo = this.grupoActual();
      if (!grupo) return;
      untracked(() =>
        this.abiertos.update((abiertos) =>
          abiertos.has(grupo) ? abiertos : new Set(abiertos).add(grupo),
        ),
      );
    });
  }

  protected alternar(etiqueta: string): void {
    this.abiertos.update((abiertos) => {
      const siguiente = new Set(abiertos);
      if (!siguiente.delete(etiqueta)) siguiente.add(etiqueta);
      return siguiente;
    });
  }

  protected cerrarSesion(): void {
    this.store.dispatch(new CerrarSesion()).subscribe(() => {
      this.navego.emit();
      this.router.navigate(['/acceso']);
    });
  }
}

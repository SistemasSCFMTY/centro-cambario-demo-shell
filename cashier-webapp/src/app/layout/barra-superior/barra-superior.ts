import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LogoNegocio } from '@components/logo-negocio/logo-negocio';
import { ICONOS_NAVEGACION, NAVEGACION } from '@data/constants/navegacion.constants';
import { SelectorModo } from '@layout/selector-modo/selector-modo';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLogIn, lucideLogOut } from '@ng-icons/lucide';
import { select, Store } from '@ngxs/store';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { CerrarSesion } from '@store/sesion/actions/sesion.actions';
import { SesionState } from '@store/sesion/state/sesion.state';
import { TemaState } from '@store/tema/state/tema.state';

/**
 * The cashier's Neuro top bar: brand, the four modules as touch-sized tabs, the theme menu and the
 * usuario menu. Always rendered in a `.dark` scope. Labels hide below md (tablets stay labeled).
 */
@Component({
  selector: 'app-barra-superior',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIcon,
    LogoNegocio,
    SelectorModo,
    HlmDropdownMenuImports,
  ],
  providers: [provideIcons({ ...ICONOS_NAVEGACION, lucideLogIn, lucideLogOut })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './barra-superior.html',
  host: { class: 'block' },
})
export class BarraSuperior {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected readonly nombreNegocio = select(TemaState.nombreNegocio);
  protected readonly usuario = select(SesionState.usuario);
  protected readonly nombreCompleto = select(SesionState.nombreCompleto);
  protected readonly iniciales = select(SesionState.iniciales);
  protected readonly etiquetaRol = select(SesionState.etiquetaRol);

  protected readonly elementos = NAVEGACION;

  protected cerrarSesion(): void {
    this.store.dispatch(new CerrarSesion()).subscribe(() => this.router.navigate(['/acceso']));
  }
}

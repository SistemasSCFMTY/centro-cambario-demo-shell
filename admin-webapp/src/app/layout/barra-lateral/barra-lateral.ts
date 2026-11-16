import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LogoNegocio } from '@components/logo-negocio/logo-negocio';
import { ICONOS_NAVEGACION, NAVEGACION } from '@data/constants/navegacion.constants';
import { SelectorModo } from '@layout/selector-modo/selector-modo';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown, lucideLogIn, lucideLogOut } from '@ng-icons/lucide';
import { select, Store } from '@ngxs/store';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { CerrarSesion } from '@store/sesion/actions/sesion.actions';
import { SesionState } from '@store/sesion/state/sesion.state';
import { TemaState } from '@store/tema/state/tema.state';

/** The Neuro sidebar card: brand, greeting, module nav, mode and usuario. Always rendered in a `.dark` scope. */
@Component({
  selector: 'app-barra-lateral',
  imports: [
    DatePipe,
    RouterLink,
    RouterLinkActive,
    NgIcon,
    LogoNegocio,
    SelectorModo,
    HlmDropdownMenuImports,
  ],
  providers: [
    provideIcons({ ...ICONOS_NAVEGACION, lucideChevronsUpDown, lucideLogIn, lucideLogOut }),
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

  protected readonly nombreNegocio = select(TemaState.nombreNegocio);
  protected readonly usuario = select(SesionState.usuario);
  protected readonly nombreCompleto = select(SesionState.nombreCompleto);
  protected readonly iniciales = select(SesionState.iniciales);
  protected readonly etiquetaRol = select(SesionState.etiquetaRol);

  protected readonly grupos = NAVEGACION;
  protected readonly hoy = new Date();

  protected cerrarSesion(): void {
    this.store.dispatch(new CerrarSesion()).subscribe(() => {
      this.navego.emit();
      this.router.navigate(['/acceso']);
    });
  }
}

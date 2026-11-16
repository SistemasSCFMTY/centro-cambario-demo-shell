import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogoNegocio } from '@components/logo-negocio/logo-negocio';
import { select } from '@ngxs/store';
import { TemaState } from '@store/tema/state/tema.state';

/** Login and OTP frame: the brand card stays Neuro dark, the form pane follows the mode like the shell's. */
@Component({
  selector: 'app-marco-acceso',
  imports: [RouterOutlet, LogoNegocio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './marco-acceso.html',
})
export class MarcoAcceso {
  protected readonly nombreNegocio = select(TemaState.nombreNegocio);
  protected readonly anio = new Date().getFullYear();
}

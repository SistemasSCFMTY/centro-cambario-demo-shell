import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { OPCIONES_MODO } from '@data/constants/tema.constants';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMonitor, lucideMoon, lucideSun } from '@ng-icons/lucide';
import { dispatch, select } from '@ngxs/store';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { EstablecerModoTema } from '@store/tema/actions/tema.actions';
import { TemaState } from '@store/tema/state/tema.state';

/** Sistema · Claro · Oscuro: an icon button in the shell's top bar that opens a radio menu. */
@Component({
  selector: 'app-selector-modo',
  imports: [NgIcon, HlmButtonImports, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideMonitor, lucideSun, lucideMoon })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './selector-modo.html',
  host: { class: 'block' },
})
export class SelectorModo {
  protected readonly modo = select(TemaState.modo);

  /** The option in effect; its icon is the trigger's face. */
  protected readonly actual = computed(
    () => this.opciones.find((opcion) => opcion.valor === this.modo()) ?? this.opciones[0],
  );

  protected readonly opciones = OPCIONES_MODO;
  protected readonly establecer = dispatch(EstablecerModoTema);
}

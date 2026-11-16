import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PASO_POR_FLECHA } from '@data/constants/teclado.constants';
import { OPCIONES_MODO } from '@data/constants/tema.constants';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMonitor, lucideMoon, lucideSun } from '@ng-icons/lucide';
import { dispatch, select } from '@ngxs/store';
import { EstablecerModoTema } from '@store/tema/actions/tema.actions';
import { TemaState } from '@store/tema/state/tema.state';

/** Sistema · Claro · Oscuro, as a three-way segmented radio group. */
@Component({
  selector: 'app-selector-modo',
  imports: [NgIcon],
  providers: [provideIcons({ lucideMonitor, lucideSun, lucideMoon })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './selector-modo.html',
  host: { class: 'block' },
})
export class SelectorModo {
  protected readonly modo = select(TemaState.modo);

  protected readonly opciones = OPCIONES_MODO;
  protected readonly establecer = dispatch(EstablecerModoTema);

  /** Arrow keys move the choice, as in a native radio group. */
  protected mover(evento: KeyboardEvent, indice: number): void {
    const paso = PASO_POR_FLECHA[evento.key];
    if (!paso) return;
    evento.preventDefault();
    const siguiente = (indice + paso + this.opciones.length) % this.opciones.length;
    this.establecer(this.opciones[siguiente].valor);
    const grupo = (evento.currentTarget as HTMLElement).parentElement;
    grupo?.querySelectorAll<HTMLButtonElement>('button')[siguiente]?.focus();
  }
}

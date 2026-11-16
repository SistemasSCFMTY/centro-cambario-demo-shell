import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EncabezadoPagina } from '@components/encabezado-pagina/encabezado-pagina';
import { ICONOS_NAVEGACION } from '@data/constants/navegacion.constants';
import { ElementoNavegacion } from '@data/interfaces/elemento-navegacion';
import { NgIcon, provideIcons } from '@ng-icons/core';

/** Phase 1 stand-in for a module that isn't built yet. The route passes its nav entry as `elemento`. */
@Component({
  selector: 'app-pagina-pendiente',
  imports: [EncabezadoPagina, NgIcon],
  providers: [provideIcons(ICONOS_NAVEGACION)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagina-pendiente.html',
})
export class PaginaPendiente {
  readonly elemento = input.required<ElementoNavegacion>();
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CLASES_PILL } from '@data/constants/pill.constants';
import { AjustePill } from '@data/interfaces/ajuste-pill';

/** A rounded status pill from the fixed semantic set. Pass an `AjustePill` from `data/constants/estatus.constants`. */
@Component({
  selector: 'app-pill-estatus',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pill-estatus.html',
  host: { class: 'inline-flex' },
})
export class PillEstatus {
  readonly ajuste = input.required<AjustePill>();

  protected readonly clases = computed(() => CLASES_PILL[this.ajuste().tono]);
}

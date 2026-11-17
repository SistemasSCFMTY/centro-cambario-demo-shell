import { DesvanecidoDesplazamiento } from '@components/desvanecido-desplazamiento/desvanecido-desplazamiento';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RegistroAuditoria } from '@data/interfaces/registro-auditoria';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHistory } from '@ng-icons/lucide';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { FechaHoraPipe } from '@pipes/fecha-hora.pipe';

/**
 * The mandatory Auditoría tab of every detail view (plans/01): who did what and when, newest first,
 * with edits shown as `antes → después`. Put it in the shell's `auditoria` tab and feed it the
 * record's entries. Empty: the flat empty state.
 */
@Component({
  selector: 'app-pestana-auditoria',
  imports: [DesvanecidoDesplazamiento, FechaHoraPipe, HlmTableImports, NgIcon],
  providers: [provideIcons({ lucideHistory })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pestana-auditoria.html',
  host: { class: 'block' },
})
export class PestanaAuditoria {
  readonly registros = input.required<readonly RegistroAuditoria[]>();
  readonly cargando = input(false);

  protected readonly ordenados = computed(() =>
    [...this.registros()].sort((a, b) => b.fecha.localeCompare(a.fecha)),
  );
}

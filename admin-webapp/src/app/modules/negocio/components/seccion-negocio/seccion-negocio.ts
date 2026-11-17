import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CampoNegocio } from '@modules/negocio/components/campo-negocio/campo-negocio';
import { CampoFormulario } from '@data/interfaces/campo-formulario-negocio';
import { OpcionCatalogo } from '@data/interfaces/opcion-catalogo';
import { OpcionesFormularioNegocio } from '@data/interfaces/opciones-formulario-negocio';
import { ControlNegocio } from '@data/types/negocio.types';
import { SeccionFormulario } from '@data/interfaces/seccion-formulario-negocio';

/**
 * One section of a negocio form page (plans/05 Admin forms): title and one line on the left, the
 * fields on the right. Extra content (a read-only value) goes in after the fields.
 */
@Component({
  selector: 'app-seccion-negocio',
  imports: [CampoNegocio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './seccion-negocio.html',
  host: {
    class: 'block border-t border-line px-8 py-8',
    role: 'group',
    '[attr.aria-labelledby]': "prefijo() + '-' + seccion().id",
  },
})
export class SeccionNegocio {
  readonly seccion = input.required<SeccionFormulario>();
  readonly grupo = input.required<FormGroup<Record<string, ControlNegocio>>>();
  readonly opciones = input<OpcionesFormularioNegocio | null>(null);
  readonly prefijo = input('campo');
  /** A municipios or localidades list is loading. */
  readonly cargandoGeografia = input(false);
  /** Why a municipios or localidades list failed to load. */
  readonly errorGeografia = input<string | null>(null);

  protected readonly tieneDomicilio = computed(() =>
    this.seccion().campos.some((campo) => campo.id === 'municipio'),
  );

  protected readonly campos = computed(() => {
    const opciones = this.opciones();
    return this.seccion().campos.map((campo) => ({
      campo,
      control: this.grupo().controls[campo.id],
      lista: this.listaDe(campo, opciones),
      padre: this.padreDe(campo),
    }));
  });

  protected readonly divisas = computed(() => this.opciones()?.divisas ?? []);

  private padreDe(campo: CampoFormulario): ControlNegocio | null {
    if (campo.fuenteOpciones === 'municipios') return this.grupo().controls['entidad'] ?? null;
    if (campo.fuenteOpciones === 'localidades') return this.grupo().controls['municipio'] ?? null;
    return null;
  }

  private listaDe(
    campo: CampoFormulario,
    opciones: OpcionesFormularioNegocio | null,
  ): OpcionCatalogo[] {
    if (!opciones || !campo.fuenteOpciones) return [];
    return opciones[campo.fuenteOpciones];
  }
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { CampoFormulario } from '@data/interfaces/campo-formulario-negocio';
import { ControlNegocio } from '@data/types/negocio.types';
import { Divisa } from '@data/interfaces/divisa';
import { OpcionCatalogo } from '@data/interfaces/opcion-catalogo';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { startWith, switchMap } from 'rxjs';

/** One labelled control of a negocio form, drawn from its field definition, with its error line. */
@Component({
  selector: 'app-campo-negocio',
  imports: [ReactiveFormsModule, HlmFieldImports, HlmInputImports, HlmSelectImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './campo-negocio.html',
  host: { '[class]': "campo().completo ? 'block min-w-0 sm:col-span-2' : 'block min-w-0'" },
})
export class CampoNegocio {
  readonly campo = input.required<CampoFormulario>();
  readonly control = input.required<ControlNegocio>();
  /** Options of a `seleccion` field: the key is what the form stores. */
  readonly opciones = input<readonly OpcionCatalogo[]>([]);
  /** Divisas of a `divisas` field. */
  readonly divisas = input<readonly Divisa[]>([]);
  /** Prefix that keeps control ids unique on the page. */
  readonly prefijo = input('campo');
  /** The control whose value this select's options depend on (municipio → entidad). */
  readonly padre = input<ControlNegocio | null>(null);
  /** The options of this select are on their way. */
  readonly cargando = input(false);

  private readonly eventos = toSignal(
    toObservable(this.control).pipe(switchMap((control) => control.events.pipe(startWith(null)))),
    { initialValue: null },
  );
  private readonly valor = toSignal(
    toObservable(this.control).pipe(
      switchMap((control) => control.valueChanges.pipe(startWith(control.value))),
    ),
    { initialValue: '' as string | string[] },
  );

  private readonly valorPadre = toSignal(
    toObservable(this.padre).pipe(
      switchMap((padre) => (padre ? padre.valueChanges.pipe(startWith(padre.value)) : [''])),
    ),
    { initialValue: '' as string | string[] },
  );

  /** A dependent select whose parent is still empty has nothing to offer. */
  protected readonly sinPadre = computed(() => !!this.padre() && !this.valorPadre());

  /** The trigger shows the label of the stored key. */
  protected readonly etiquetaOpcion = computed(() => {
    const etiquetas = new Map(this.opciones().map((opcion) => [opcion.clave, opcion.etiqueta]));
    return (clave: string) => etiquetas.get(clave) ?? clave;
  });

  protected readonly idControl = computed(() => `${this.prefijo()}-${this.campo().id}`);
  protected readonly idAyuda = computed(() => `${this.idControl()}-ayuda`);

  protected readonly opcionesDivisas = computed(() => {
    const valor = this.valor();
    const marcadas = new Set(Array.isArray(valor) ? valor : []);
    return this.divisas().map((divisa) => ({ ...divisa, marcada: marcadas.has(divisa.clave) }));
  });

  /** The first option of a select: an invitation, or what is missing while a dependent list is empty. */
  protected readonly textoVacio = computed(() => {
    const campo = this.campo();
    if (this.opciones().length > 0) return 'Seleccione una opción';
    if (this.cargando() && !this.sinPadre()) {
      return campo.fuenteOpciones === 'municipios'
        ? 'Cargando municipios…'
        : 'Cargando localidades…';
    }
    return campo.textoSinOpciones ?? 'Seleccione una opción';
  });

  /** Only points at the help or error line when it is drawn. */
  protected readonly describedBy = computed(() =>
    this.mensaje() || this.campo().ayuda ? this.idAyuda() : null,
  );

  protected readonly mensaje = computed(() => {
    this.eventos();
    const control = this.control();
    const campo = this.campo();
    if (!control.invalid || !control.touched) return null;
    const errores = control.errors ?? {};
    if (errores['required']) return campo.mensajeRequerido ?? 'Este dato es obligatorio.';
    if (errores['noFutura']) return 'La fecha no puede ser posterior a hoy.';
    if (errores['maxlength']) return `Escriba máximo ${campo.maxLongitud} caracteres.`;
    return campo.mensajeFormato ?? 'Revise este dato.';
  });

  protected alternarDivisa(clave: string, marcada: boolean): void {
    const actual = this.control().value;
    const lista = Array.isArray(actual) ? actual : [];
    const nueva = this.divisas()
      .map((divisa) => divisa.clave)
      .filter((c) => (c === clave ? marcada : lista.includes(c)));
    this.control().setValue(nueva);
    this.control().markAsDirty();
    this.control().markAsTouched();
  }
}

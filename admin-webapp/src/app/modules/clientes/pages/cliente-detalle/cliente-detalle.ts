import { DesvanecidoDesplazamiento } from '@components/desvanecido-desplazamiento/desvanecido-desplazamiento';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CuadriculaCampos } from '@components/cuadricula-campos/cuadricula-campos';
import { DetallePagina } from '@components/detalle-pagina/detalle-pagina';
import { EncabezadoPagina } from '@components/encabezado-pagina/encabezado-pagina';
import { PestanaAuditoria } from '@components/pestana-auditoria/pestana-auditoria';
import { PillEstatus } from '@components/pill-estatus/pill-estatus';
import {
  ETIQUETA_TIPO_PEP,
  NIVELES_EXPEDIENTE,
  PESTANAS_CLIENTE,
  PESTANAS_SOLO_PM,
  PILL_COTEJADO,
  PILL_NIVEL_EXPEDIENTE,
  PILL_REQUISITO_NIVEL,
  REQUISITOS_NIVEL,
} from '@data/constants/clientes.constants';
import {
  DESTINOS_RECURSOS,
  ETIQUETA_TIPO_OPERACION,
  ETIQUETA_TIPO_PERSONA,
  ORIGENES_RECURSOS,
} from '@data/constants/dominio.constants';
import {
  PILL_ESTATUS_CLIENTE,
  PILL_ESTATUS_OPERACION,
  PILL_RELEVANTE,
} from '@data/constants/estatus.constants';
import { REGLAS_OPERACION } from '@data/constants/reglas-operacion.constants';
import { AjustePill } from '@data/interfaces/ajuste-pill';
import { CampoDetalle } from '@data/interfaces/campo-detalle';
import { OpcionCatalogo } from '@data/interfaces/opcion-catalogo';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideFileText, lucideMinus, lucideSearchX } from '@ng-icons/lucide';
import { Store } from '@ngxs/store';
import { FechaHoraPipe } from '@pipes/fecha-hora.pipe';
import { FechaPipe } from '@pipes/fecha.pipe';
import { MontoPipe } from '@pipes/monto.pipe';
import { NumeroPipe } from '@pipes/numero.pipe';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { CargarCliente, CargarClienteOperaciones } from '@store/clientes/actions/clientes.actions';
import { ClientesState } from '@store/clientes/state/clientes.state';
import { formatearNumero } from '@utils/dinero/formato-dinero';
import { formatearFecha } from '@utils/fechas/fechas';

/** `/clientes/:id`: the read-only 360 of one cliente (General · Movimientos · Representantes legales · Beneficiarios · Operaciones · Documentos · Declaración PEP · Auditoría). */
@Component({
  selector: 'app-cliente-detalle',
  imports: [
    CuadriculaCampos,
    DesvanecidoDesplazamiento,
    DetallePagina,
    EncabezadoPagina,
    FechaHoraPipe,
    FechaPipe,
    HlmTableImports,
    MontoPipe,
    NgIcon,
    NumeroPipe,
    PestanaAuditoria,
    PillEstatus,
    RouterLink,
  ],
  providers: [provideIcons({ lucideCheck, lucideFileText, lucideMinus, lucideSearchX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cliente-detalle.html',
})
export class ClienteDetallePagina {
  private readonly store = inject(Store);

  readonly id = input.required<string>();

  protected readonly pestana = signal<string | undefined>(undefined);

  private readonly detalleCrudo = this.store.selectSignal(ClientesState.detalle);
  protected readonly operaciones = this.store.selectSignal(ClientesState.operaciones);
  protected readonly cargandoOperaciones = this.store.selectSignal(
    ClientesState.cargandoOperaciones,
  );
  protected readonly errorOperaciones = this.store.selectSignal(ClientesState.errorOperaciones);
  protected readonly noEncontrado = this.store.selectSignal(ClientesState.detalleNoEncontrado);
  protected readonly error = this.store.selectSignal(ClientesState.error);

  /** The loaded cliente, only while it is the one in the URL. */
  protected readonly detalle = computed(() => {
    const detalle = this.detalleCrudo();
    return detalle?.cliente.id === this.id() ? detalle : null;
  });
  protected readonly cliente = computed(() => this.detalle()?.cliente ?? null);
  protected readonly esqueleto = computed(
    () => this.detalle() === null && !this.error() && !this.noEncontrado(),
  );

  protected readonly pestanas = computed(() =>
    this.cliente()?.tipoPersona === 'PF'
      ? PESTANAS_CLIENTE.filter((p) => !PESTANAS_SOLO_PM.includes(p.id))
      : PESTANAS_CLIENTE,
  );

  /** `PEP nacional` or `PEP extranjera` when the cliente is one. */
  protected readonly pillPep = computed<AjustePill | null>(() => {
    const c = this.cliente();
    if (!c?.esPep) return null;
    return { tono: 'warning', etiqueta: c.tipoPep ? ETIQUETA_TIPO_PEP[c.tipoPep] : 'PEP' };
  });

  protected readonly descripcion = computed(() => {
    const cliente = this.cliente();
    if (!cliente) return undefined;
    return `${cliente.numeroCliente} · ${ETIQUETA_TIPO_PERSONA[cliente.tipoPersona]} · Alta ${formatearFecha(cliente.fechaAlta)}`;
  });

  /** What the expediente level lets the cliente operate (plans/03 §2 thresholds). */
  protected readonly puedeOperar = computed(() => {
    const cliente = this.cliente();
    if (cliente?.estatus === 'BLOQUEADO') return 'El cliente está bloqueado: no puede operar.';
    if (cliente?.estatus === 'SUSPENDIDO') return 'El cliente está suspendido: no puede operar.';
    switch (cliente?.nivelExpediente ?? 0) {
      case 0:
        return `No puede operar desde ${formatearNumero(REGLAS_OPERACION.umbralNivel1Usd, 0)} USD`;
      case 1:
        return `Puede operar montos menores a ${formatearNumero(REGLAS_OPERACION.umbralNivel2Usd, 0)} USD`;
      case 2:
        return `Puede operar montos menores a ${formatearNumero(REGLAS_OPERACION.umbralNivel3Usd, 0)} USD`;
      default:
        return 'Puede operar cualquier monto';
    }
  });

  protected readonly niveles = computed(() => {
    const cliente = this.cliente();
    if (!cliente) return [];
    return NIVELES_EXPEDIENTE.map((nivel) => {
      const completo = cliente.nivelExpediente >= nivel;
      return {
        nivel,
        pill: PILL_REQUISITO_NIVEL[completo ? 'completo' : 'pendiente'],
        completo,
        requisitos: REQUISITOS_NIVEL[cliente.tipoPersona][nivel],
      };
    });
  });

  protected readonly campos = computed<CampoDetalle[]>(() => {
    const c = this.cliente();
    if (!c) return [];
    const origen = this.etiquetaDe(ORIGENES_RECURSOS, c.origenRecursos);
    const destino = this.etiquetaDe(DESTINOS_RECURSOS, c.destinoRecursos);
    const identificacion = `${c.tipoIdentificacion} · ${c.numeroIdentificacion}`;
    const vigencia = c.vencimientoIdentificacion
      ? formatearFecha(c.vencimientoIdentificacion)
      : 'No aplica';
    const comunes: CampoDetalle[] = [
      { etiqueta: 'Domicilio', valor: c.domicilio },
      { etiqueta: 'Teléfono', valor: c.telefono, dato: true },
      { etiqueta: 'Correo', valor: c.correo },
      { etiqueta: 'Origen de los recursos', valor: origen },
      { etiqueta: 'Destino de los recursos', valor: destino },
    ];
    const pep: CampoDetalle[] = c.tipoPep
      ? [{ etiqueta: 'Persona políticamente expuesta', valor: ETIQUETA_TIPO_PEP[c.tipoPep] }]
      : [];
    if (c.tipoPersona === 'PM') {
      return [
        { etiqueta: 'Giro, actividad u objeto social', valor: c.actividad },
        { etiqueta: 'Nacionalidad', valor: c.nacionalidad },
        { etiqueta: 'RFC', valor: c.rfc, dato: true },
        { etiqueta: 'Fecha de constitución', valor: formatearFecha(c.fechaBase), dato: true },
        { etiqueta: 'Quien comparece', valor: c.representante },
        { etiqueta: 'Identificación de quien comparece', valor: identificacion, dato: true },
        { etiqueta: 'Vigencia de la identificación', valor: vigencia, dato: true },
        ...comunes,
      ];
    }
    return [
      { etiqueta: 'Fecha de nacimiento', valor: formatearFecha(c.fechaBase), dato: true },
      { etiqueta: 'Nacionalidad', valor: c.nacionalidad },
      { etiqueta: 'CURP', valor: c.curp, dato: true },
      { etiqueta: 'RFC', valor: c.rfc, dato: true },
      { etiqueta: 'Ocupación', valor: c.actividad },
      { etiqueta: 'Identificación', valor: identificacion, dato: true },
      { etiqueta: 'Vigencia de la identificación', valor: vigencia, dato: true },
      ...pep,
      ...comunes,
    ];
  });

  protected readonly divisasMes = computed(
    () => this.operaciones()?.resumen.divisasMes.join(', ') ?? '',
  );

  protected readonly camposRepresentante = computed<CampoDetalle[]>(() => {
    const c = this.cliente();
    if (!c) return [];
    return [
      { etiqueta: 'Quien comparece', valor: c.representante },
      {
        etiqueta: 'Identificación de quien comparece',
        valor: `${c.tipoIdentificacion} · ${c.numeroIdentificacion}`,
        dato: true,
      },
      {
        etiqueta: 'Vigencia de la identificación',
        valor: c.vencimientoIdentificacion
          ? formatearFecha(c.vencimientoIdentificacion)
          : 'No aplica',
        dato: true,
      },
    ];
  });

  protected readonly camposPep = computed<CampoDetalle[]>(() => {
    const c = this.cliente();
    if (!c?.esPep || !c.tipoPep) return [];
    return [
      { etiqueta: 'Persona políticamente expuesta', valor: 'Sí' },
      { etiqueta: 'Tipo', valor: ETIQUETA_TIPO_PEP[c.tipoPep] },
    ];
  });

  protected readonly documentos = computed(() =>
    (this.cliente()?.documentos ?? []).map((documento) => ({
      ...documento,
      tamano: `${formatearNumero(documento.tamanoBytes / 1024, 0)} KB`,
      cotejado: PILL_COTEJADO[documento.cotejadoOriginal ? 'si' : 'no'],
    })),
  );

  protected readonly limiteDiarioUsd = REGLAS_OPERACION.limiteDiarioUsd;
  protected readonly pillEstatus = PILL_ESTATUS_CLIENTE;
  protected readonly pillNivel = PILL_NIVEL_EXPEDIENTE;
  protected readonly pillRelevante = PILL_RELEVANTE;
  protected readonly pillEstatusOperacion = PILL_ESTATUS_OPERACION;
  protected readonly etiquetaTipo = ETIQUETA_TIPO_OPERACION;

  constructor() {
    effect(() => {
      const id = this.id();
      untracked(() => {
        this.store.dispatch(new CargarCliente(id));
        this.store.dispatch(new CargarClienteOperaciones(id));
      });
    });
  }

  private etiquetaDe(opciones: readonly OpcionCatalogo[], clave: string): string {
    return opciones.find((o) => o.clave === clave)?.etiqueta ?? clave;
  }
}

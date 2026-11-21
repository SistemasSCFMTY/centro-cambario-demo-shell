import { RecordNotFound } from '@components/record-not-found/record-not-found';
import { ErrorNotice } from '@components/error-notice/error-notice';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CuadriculaCampos } from '@components/cuadricula-campos/cuadricula-campos';
import { DetallePagina } from '@components/detalle-pagina/detalle-pagina';
import { PestanaAuditoria } from '@components/pestana-auditoria/pestana-auditoria';
import { PillEstatus } from '@components/pill-estatus/pill-estatus';
import {
  DESTINOS_RECURSOS,
  ETIQUETA_INSTRUMENTO,
  ETIQUETA_NIVEL,
  ETIQUETA_TIPO_OPERACION,
  ORIGENES_RECURSOS,
} from '@data/constants/dominio.constants';
import { PILL_ESTATUS_OPERACION, PILL_RELEVANTE } from '@data/constants/estatus.constants';
import { OperacionListaDto } from '@data/dto/operaciones.dto';
import { SeccionOperacion } from '@data/interfaces/seccion-operacion';
import { select, Store } from '@ngxs/store';
import { CargarOperacion } from '@store/operaciones/actions/operaciones.actions';
import { OperacionesState } from '@store/operaciones/state/operaciones.state';
import { formatearMonto, formatearTipoCambio } from '@utils/dinero/formato-dinero';
import { formatearFecha, formatearFechaHora } from '@utils/fechas/fechas';

/**
 * `/operaciones/:id`: the folio, its calculation, the cliente, its classification and the
 * authorization trail, plus the mandatory Auditoría tab. Read-only in the admin.
 */
@Component({
  selector: 'app-operacion-detalle',
  imports: [
    ErrorNotice,
    CuadriculaCampos,
    DetallePagina,
    PestanaAuditoria,
    PillEstatus,
    RecordNotFound,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './operacion-detalle.html',
})
export class OperacionDetalle {
  private readonly store = inject(Store);
  private readonly ruta = inject(ActivatedRoute);

  protected readonly pestana = signal<string | undefined>(undefined);

  private readonly parametros = toSignal(this.ruta.paramMap, {
    initialValue: this.ruta.snapshot.paramMap,
  });
  protected readonly detalle = select(OperacionesState.detalle);
  protected readonly cargandoEstado = select(OperacionesState.cargando);
  protected readonly error = select(OperacionesState.error);
  protected readonly noEncontradaEstado = select(OperacionesState.noEncontrada);
  private readonly id = computed(() => this.parametros().get('id') ?? '');

  /** The loaded operación, only when it is the one in the URL (never a stale one). */
  protected readonly operacion = computed<OperacionListaDto | null>(() => {
    const detalle = this.detalle();
    return detalle?.operacion.id === this.id() ? detalle.operacion : null;
  });
  protected readonly auditoria = computed(() => {
    const detalle = this.detalle();
    return detalle?.operacion.id === this.id() ? detalle.auditoria : [];
  });
  protected readonly cargando = computed(
    () => !this.operacion() && (this.cargandoEstado() || !this.error()),
  );
  protected readonly noEncontrada = computed(
    () => !this.operacion() && !this.cargando() && this.noEncontradaEstado(),
  );
  protected readonly falla = computed(
    () => !this.operacion() && !this.cargando() && !this.noEncontradaEstado(),
  );

  protected readonly titulo = computed(() => {
    const operacion = this.operacion();
    return operacion ? `Operación ${operacion.folio}` : 'Operación';
  });
  protected readonly descripcion = computed(() => {
    const o = this.operacion();
    return o
      ? `${ETIQUETA_TIPO_OPERACION[o.tipo]} de ${formatearMonto(o.montoDivisa, o.divisa)} · ${formatearFechaHora(o.fechaOperacion)}`
      : undefined;
  });
  protected readonly pill = computed(() => {
    const o = this.operacion();
    return o ? PILL_ESTATUS_OPERACION[o.estatus] : null;
  });

  protected readonly secciones = computed<readonly SeccionOperacion[]>(() => {
    const o = this.operacion();
    if (!o) return [];
    const origen = ORIGENES_RECURSOS.find((x) => x.clave === o.origenRecursos)?.etiqueta;
    const destino = DESTINOS_RECURSOS.find((x) => x.clave === o.destinoRecursos)?.etiqueta;
    return [
      {
        id: 'operacion',
        titulo: 'Operación',
        descripcion: 'Folio, forma de liquidación y dónde se registró.',
        campos: [
          { etiqueta: 'Folio', valor: o.folio, dato: true },
          { etiqueta: 'Fecha y hora', valor: formatearFechaHora(o.fechaOperacion), dato: true },
          { etiqueta: 'Tipo', valor: `${ETIQUETA_TIPO_OPERACION[o.tipo]} de ${o.divisa}` },
          { etiqueta: 'Forma de liquidación', valor: ETIQUETA_INSTRUMENTO[o.instrumento] },
          { etiqueta: 'Sucursal', valor: o.sucursal },
          { etiqueta: 'Caja', valor: o.caja },
          { etiqueta: 'Cajero', valor: o.cajero },
        ],
      },
      {
        id: 'calculo',
        titulo: 'Cálculo',
        descripcion:
          'Importes con el tipo de cambio de ventanilla y el FIX del día hábil anterior.',
        campos: [
          {
            etiqueta: 'Monto en divisa',
            valor: formatearMonto(o.montoDivisa, o.divisa),
            dato: true,
          },
          { etiqueta: 'Tipo de cambio', valor: formatearTipoCambio(o.tipoCambio), dato: true },
          { etiqueta: 'Importe en pesos', valor: formatearMonto(o.montoMxn, 'MXN'), dato: true },
          { etiqueta: 'FIX aplicado', valor: formatearTipoCambio(o.fixTipoCambio), dato: true },
          { etiqueta: 'Fecha del FIX', valor: formatearFecha(o.fixFecha), dato: true },
          { etiqueta: 'Equivalente en USD', valor: formatearMonto(o.montoUsd, 'USD'), dato: true },
        ],
      },
      {
        id: 'cliente',
        titulo: 'Cliente',
        descripcion: 'Quién operó y lo que declaró sobre sus recursos.',
        campos: [
          o.clienteId
            ? { etiqueta: 'Cliente', valor: o.cliente, enlace: ['/clientes', o.clienteId] }
            : { etiqueta: 'Cliente', valor: o.nombreOcasional ?? 'Cliente ocasional' },
          { etiqueta: 'Número de cliente', valor: o.numeroCliente, dato: true },
          { etiqueta: 'Origen de los recursos', valor: origen },
          { etiqueta: 'Destino de los recursos', valor: destino },
        ],
      },
      {
        id: 'clasificacion',
        titulo: 'Clasificación',
        descripcion: 'Lo que la normativa exige por el monto y la forma de liquidación.',
        campos: [
          { etiqueta: 'Identificación requerida', valor: ETIQUETA_NIVEL[o.nivelRequerido] },
          o.esRelevante
            ? { etiqueta: 'Operación relevante', pill: PILL_RELEVANTE }
            : { etiqueta: 'Operación relevante', valor: 'No' },
          {
            etiqueta: 'Compra de USD en efectivo reportable',
            valor: o.reportableCompraUsd ? 'Sí' : 'No',
          },
          { etiqueta: 'Requiere autorización', valor: o.requiereAutorizacion ? 'Sí' : 'No' },
        ],
      },
      ...(o.requiereAutorizacion
        ? [
            {
              id: 'autorizacion',
              titulo: 'Autorización',
              descripcion: 'Motivo, quién la resolvió y cuándo.',
              campos: [
                { etiqueta: 'Motivo', valor: o.motivoAutorizacion },
                { etiqueta: 'Resuelta por', valor: o.autorizadoPor },
                {
                  etiqueta: 'Fecha de resolución',
                  valor: formatearFechaHora(o.autorizadoEn),
                  dato: true,
                },
                { etiqueta: 'Comentario', valor: o.comentarioAutorizacion },
              ],
            },
          ]
        : []),
    ];
  });

  constructor() {
    effect(() => {
      const id = this.id();
      untracked(() => this.store.dispatch(new CargarOperacion(id)));
    });
  }

  protected retry(): void {
    this.store.dispatch(new CargarOperacion(this.id()));
  }
}

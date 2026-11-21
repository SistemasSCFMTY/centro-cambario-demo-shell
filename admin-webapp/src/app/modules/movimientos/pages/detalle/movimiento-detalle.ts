import { RecordNotFound } from '@components/record-not-found/record-not-found';
import { ErrorNotice } from '@components/error-notice/error-notice';
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
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CuadriculaCampos } from '@components/cuadricula-campos/cuadricula-campos';
import { DetallePagina } from '@components/detalle-pagina/detalle-pagina';
import { PestanaAuditoria } from '@components/pestana-auditoria/pestana-auditoria';
import { PillEstatus } from '@components/pill-estatus/pill-estatus';
import {
  CLASE_PUNTO_PASO,
  ETIQUETA_CLASE_MOVIMIENTO,
  ETIQUETA_FECHA_RESOLUCION_MOVIMIENTO,
  ETIQUETA_RESOLUCION_MOVIMIENTO,
  PILL_ESTATUS_MOVIMIENTO,
} from '@data/constants/movimientos.constants';
import { CampoDetalle } from '@data/interfaces/campo-detalle';
import { PestanaDetalle } from '@data/interfaces/pestana-detalle';
import { select, Store } from '@ngxs/store';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { FechaHoraPipe } from '@pipes/fecha-hora.pipe';
import { MontoPipe } from '@pipes/monto.pipe';
import { CargarMovimiento } from '@store/movimientos/actions/movimientos.actions';
import { MovimientosState } from '@store/movimientos/state/movimientos.state';
import { SesionState } from '@store/sesion/state/sesion.state';
import { formatearFechaHora } from '@utils/fechas/fechas';

/** `/movimientos/:id`: origin, destination, amounts per currency, status trail and Auditoría. */
@Component({
  selector: 'app-movimiento-detalle',
  imports: [
    ErrorNotice,
    CuadriculaCampos,
    DesvanecidoDesplazamiento,
    DetallePagina,
    FechaHoraPipe,
    HlmButtonImports,
    HlmTableImports,
    MontoPipe,
    PestanaAuditoria,
    PillEstatus,
    RecordNotFound,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movimiento-detalle.html',
})
export class MovimientoDetalle {
  private readonly store = inject(Store);

  /** Passed on to the review page, so coming back here keeps the list's back link. */
  protected readonly historyState = (inject(Location).getState() ?? {}) as Record<string, unknown>;

  /** The `:id` of the route. */
  readonly id = input.required<string>();

  protected readonly pestana = signal<string | undefined>(undefined);

  protected readonly detalle = select(MovimientosState.detalle);
  protected readonly cargando = select(MovimientosState.cargandoDetalle);
  protected readonly error = select(MovimientosState.errorDetalle);
  protected readonly notFound = select(MovimientosState.notFound);
  protected readonly usuario = select(SesionState.usuario);

  protected readonly movimiento = computed(() => this.detalle()?.movimiento ?? null);
  protected readonly titulo = computed(() => this.movimiento()?.folio ?? 'Movimiento');
  protected readonly descripcion = computed(() => {
    const movimiento = this.movimiento();
    return movimiento ? ETIQUETA_CLASE_MOVIMIENTO[movimiento.clase] : undefined;
  });
  protected readonly pill = computed(() => {
    const movimiento = this.movimiento();
    return movimiento ? PILL_ESTATUS_MOVIMIENTO[movimiento.estatus] : null;
  });
  protected readonly esDotacion = computed(() => this.movimiento()?.clase === 'DOTACION');
  protected readonly porRevisar = computed(
    () => this.esDotacion() && this.movimiento()?.estatus === 'PENDIENTE_APROBACION',
  );
  protected readonly puedeRevisar = computed(
    () => this.porRevisar() && this.usuario()?.rol === 'SUPERADMIN',
  );
  protected readonly muestraAutorizado = computed(() => this.movimiento()?.estatus === 'APROBADA');
  protected readonly etiquetaSolicitado = computed(() =>
    this.esDotacion() ? 'Solicitado' : 'Monto',
  );
  protected readonly etiquetaNota = computed(() =>
    this.movimiento()?.estatus === 'APROBADA' ? 'Comentario de la revisión' : 'Motivo',
  );

  /** One row per currency asked for, with what was authorized after the review. */
  protected readonly filasMontos = computed(() => {
    const movimiento = this.movimiento();
    if (!movimiento) return [];
    return movimiento.montosSolicitados.map((pedido) => {
      const autorizado = movimiento.montos.find((m) => m.divisa === pedido.divisa)?.monto ?? 0;
      return { divisa: pedido.divisa, solicitado: pedido.monto, autorizado };
    });
  });

  protected readonly campos = computed<CampoDetalle[]>(() => {
    const m = this.movimiento();
    const pill = this.pill();
    if (!m || !pill) return [];
    return [
      { etiqueta: 'Folio', valor: m.folio, dato: true },
      { etiqueta: 'Tipo', valor: ETIQUETA_CLASE_MOVIMIENTO[m.clase] },
      { etiqueta: 'Estatus', pill },
      {
        etiqueta: 'Origen',
        valor: m.origenTipo === 'CAJA' ? `${m.origen} · ${m.origenDetalle}` : m.origen,
      },
      {
        etiqueta: 'Destino',
        valor: m.destinoTipo === 'CAJA' ? `${m.destino} · ${m.destinoDetalle}` : m.destino,
      },
      {
        etiqueta: m.clase === 'DOTACION' ? 'Solicitó' : 'Envió',
        valor: m.solicitadoPor,
      },
      {
        etiqueta: m.clase === 'DOTACION' ? 'Fecha de solicitud' : 'Fecha de envío',
        valor: formatearFechaHora(m.fecha),
        dato: true,
      },
      ...(m.resueltoPor
        ? [
            { etiqueta: ETIQUETA_RESOLUCION_MOVIMIENTO[m.estatus], valor: m.resueltoPor },
            {
              etiqueta: ETIQUETA_FECHA_RESOLUCION_MOVIMIENTO[m.estatus],
              valor: formatearFechaHora(m.resueltoEn),
              dato: true,
            },
          ]
        : []),
    ];
  });

  protected readonly camposTransporte = computed<CampoDetalle[]>(() => {
    const traslado = this.movimiento()?.traslado;
    if (!traslado) return [];
    return [
      { etiqueta: 'Empresa de transporte', valor: traslado.empresaTransporte },
      { etiqueta: 'Guardia', valor: traslado.guardia },
      { etiqueta: 'Vehículo', valor: traslado.vehiculo },
      { etiqueta: 'Marchamo', valor: traslado.marchamo, dato: true },
      { etiqueta: 'Recolección', valor: formatearFechaHora(traslado.recoleccionEn), dato: true },
      { etiqueta: 'Entrega', valor: formatearFechaHora(traslado.entregaEn), dato: true },
    ];
  });

  protected readonly pestanas: PestanaDetalle[] = [{ id: 'general', etiqueta: 'General' }];
  protected readonly clasePunto = CLASE_PUNTO_PASO;

  constructor() {
    effect(() => {
      const id = this.id();
      untracked(() => this.store.dispatch(new CargarMovimiento(id)));
    });
  }

  protected retry(): void {
    this.store.dispatch(new CargarMovimiento(this.id()));
  }
}

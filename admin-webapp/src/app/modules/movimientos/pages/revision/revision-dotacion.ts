import { RecordNotFound } from '@components/record-not-found/record-not-found';
import { ErrorNotice } from '@components/error-notice/error-notice';
import { Location } from '@angular/common';
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
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BarraAcciones } from '@components/barra-acciones/barra-acciones';
import { CuadriculaCampos } from '@components/cuadricula-campos/cuadricula-campos';
import { EncabezadoPagina } from '@components/encabezado-pagina/encabezado-pagina';
import { PillEstatus } from '@components/pill-estatus/pill-estatus';
import { PILL_ESTATUS_MOVIMIENTO } from '@data/constants/movimientos.constants';
import { CampoDetalle } from '@data/interfaces/campo-detalle';
import { MontoMovimiento } from '@data/interfaces/monto-movimiento';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInbox } from '@ng-icons/lucide';
import { select, Store } from '@ngxs/store';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { MontoPipe } from '@pipes/monto.pipe';
import {
  AprobarDotacion,
  CargarMovimiento,
  LimpiarErrorRevision,
  RechazarDotacion,
} from '@store/movimientos/actions/movimientos.actions';
import { MovimientosState } from '@store/movimientos/state/movimientos.state';
import { SesionState } from '@store/sesion/state/sesion.state';
import { formatearFechaHora } from '@utils/fechas/fechas';

/**
 * `/movimientos/:id/revisar`: the review of a pending dotación, for superadmins only. Two paths:
 * correct the amounts (when needed) and approve in the same review, or decline completely with a
 * required motive. Both are confirmed in a dialog; the correction lands in the status trail.
 */
@Component({
  selector: 'app-revision-dotacion',
  imports: [
    ErrorNotice,
    BarraAcciones,
    CuadriculaCampos,
    EncabezadoPagina,
    HlmButtonImports,
    HlmDialogImports,
    HlmFieldImports,
    HlmInputImports,
    HlmSpinner,
    HlmTextareaImports,
    MontoPipe,
    NgIcon,
    PillEstatus,
    ReactiveFormsModule,
    RecordNotFound,
    RouterLink,
  ],
  providers: [provideIcons({ lucideInbox })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './revision-dotacion.html',
})
export class RevisionDotacion {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  /** The detail's history state, handed back so its back link still returns to the list view. */
  protected readonly historyState = (inject(Location).getState() ?? {}) as Record<string, unknown>;
  private readonly fb = inject(NonNullableFormBuilder);

  /** The `:id` of the route. */
  readonly id = input.required<string>();

  protected readonly montos = this.fb.array<FormControl<number | null>>([]);
  protected readonly comentario = this.fb.control('');
  protected readonly motivo = this.fb.control('', [Validators.required, Validators.pattern(/\S/)]);

  protected readonly dialogoAprobacion = signal<'open' | 'closed'>('closed');
  protected readonly dialogoRechazo = signal<'open' | 'closed'>('closed');

  protected readonly detalle = select(MovimientosState.detalle);
  protected readonly cargando = select(MovimientosState.cargandoDetalle);
  protected readonly error = select(MovimientosState.errorDetalle);
  protected readonly notFound = select(MovimientosState.notFound);
  protected readonly guardando = select(MovimientosState.guardando);
  protected readonly errorRevision = select(MovimientosState.errorRevision);
  protected readonly usuario = select(SesionState.usuario);

  private readonly valores = toSignal(this.montos.valueChanges, { initialValue: [] });

  protected readonly movimiento = computed(() => {
    const movimiento = this.detalle()?.movimiento;
    return movimiento?.id === this.id() ? movimiento : null;
  });
  protected readonly revisable = computed(
    () =>
      this.movimiento()?.clase === 'DOTACION' &&
      this.movimiento()?.estatus === 'PENDIENTE_APROBACION' &&
      this.usuario()?.rol === 'SUPERADMIN',
  );
  protected readonly titulo = computed(() => {
    const movimiento = this.movimiento();
    return movimiento ? `Revisar ${movimiento.folio}` : 'Revisar dotación';
  });
  protected readonly pill = computed(() => {
    const movimiento = this.movimiento();
    return movimiento ? PILL_ESTATUS_MOVIMIENTO[movimiento.estatus] : null;
  });

  /** What was asked, per currency, next to what the reviewer typed. */
  protected readonly lineas = computed(() => {
    const solicitados = this.movimiento()?.montosSolicitados ?? [];
    const valores = this.valores();
    const decimalesPorDivisa = this.detalle()?.decimales;
    return solicitados.map((pedido, i) => {
      const capturado = valores[i] ?? null;
      const decimales = decimalesPorDivisa?.[pedido.divisa] ?? 2;
      return {
        divisa: pedido.divisa,
        solicitado: pedido.monto,
        capturado,
        cambia: capturado !== pedido.monto,
        negativo: capturado !== null && capturado < 0,
        excedeDecimales: capturado !== null && Number(capturado.toFixed(decimales)) !== capturado,
        paso: decimales === 0 ? '1' : '0.01',
      };
    });
  });
  protected readonly montosAutorizados = computed<MontoMovimiento[]>(() =>
    this.lineas()
      .filter((l) => l.capturado !== null && l.capturado > 0)
      .map((l) => ({ divisa: l.divisa, monto: l.capturado as number })),
  );
  protected readonly valido = computed(
    () =>
      this.montosAutorizados().length > 0 &&
      this.lineas().every((l) => l.capturado !== null && !l.negativo && !l.excedeDecimales),
  );
  protected readonly hayNegativos = computed(() => this.lineas().some((l) => l.negativo));
  protected readonly hayExcesoDecimales = computed(() =>
    this.lineas().some((l) => l.excedeDecimales),
  );
  protected readonly hayCorreccion = computed(() => this.lineas().some((l) => l.cambia));
  protected readonly etiquetaAprobar = computed(() =>
    this.hayCorreccion() ? 'Corregir y aprobar' : 'Aprobar',
  );

  protected readonly camposSolicitud = computed<CampoDetalle[]>(() => {
    const m = this.movimiento();
    if (!m) return [];
    return [
      { etiqueta: 'Folio', valor: m.folio, dato: true },
      { etiqueta: 'Solicitó', valor: m.solicitadoPor },
      { etiqueta: 'Origen', valor: `${m.origen} · ${m.origenDetalle}` },
      { etiqueta: 'Destino', valor: `${m.destino} · ${m.destinoDetalle}` },
      { etiqueta: 'Fecha de solicitud', valor: formatearFechaHora(m.fecha), dato: true },
      { etiqueta: 'Observaciones', valor: m.observaciones },
    ];
  });

  constructor() {
    effect(() => {
      const id = this.id();
      untracked(() => this.store.dispatch(new CargarMovimiento(id)));
    });
    effect(() => {
      const movimiento = this.movimiento();
      if (movimiento?.estatus !== 'PENDIENTE_APROBACION') return;
      untracked(() => {
        this.montos.clear();
        for (const pedido of movimiento.montosSolicitados) {
          this.montos.push(new FormControl<number | null>(pedido.monto, [Validators.min(0)]));
        }
        this.comentario.reset();
      });
    });
  }

  protected retry(): void {
    this.store.dispatch(new CargarMovimiento(this.id()));
  }

  protected volver(): void {
    this.router.navigate(['/movimientos', this.id()], { state: this.historyState });
  }

  protected pedirAprobacion(): void {
    if (!this.valido()) return;
    this.store.dispatch(new LimpiarErrorRevision());
    this.dialogoAprobacion.set('open');
  }

  protected pedirRechazo(): void {
    this.store.dispatch(new LimpiarErrorRevision());
    this.motivo.reset();
    this.dialogoRechazo.set('open');
  }

  protected confirmarAprobacion(): void {
    const usuario = this.usuario();
    if (!usuario || !this.valido()) return;
    this.store
      .dispatch(
        new AprobarDotacion(
          this.id(),
          usuario.id,
          this.montosAutorizados(),
          this.comentario.value.trim() || null,
        ),
      )
      .subscribe({ next: () => this.volver(), error: () => undefined });
  }

  protected confirmarRechazo(): void {
    const usuario = this.usuario();
    if (!usuario || this.motivo.invalid) {
      this.motivo.markAsTouched();
      return;
    }
    this.store
      .dispatch(new RechazarDotacion(this.id(), usuario.id, this.motivo.value.trim()))
      .subscribe({ next: () => this.volver(), error: () => undefined });
  }
}

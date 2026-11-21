import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MENSAJE_ERROR_GENERICO } from '@data/constants/autenticacion.constants';
import { MENSAJE_ERROR_REVISION, MOVIMIENTOS_INICIAL } from '@data/constants/movimientos.constants';
import { MovimientoDetalleDto, MovimientosPaginaDto } from '@data/dto/movimientos.dto';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CatalogosService } from '@services/catalogos/catalogos.service';
import { MovimientosService } from '@services/movimientos/movimientos.service';
import {
  AprobarDotacion,
  CargarMovimiento,
  CargarMovimientos,
  CargarSucursalesMovimientos,
  ExportarMovimientos,
  LimpiarErrorRevision,
  RechazarDotacion,
} from '@store/movimientos/actions/movimientos.actions';
import { MovimientosStateModel } from '@store/movimientos/types/movimientos.types';
import { Sucursal } from '@data/interfaces/sucursal';
import { hoyIso } from '@utils/fechas/fechas';
import { catchError, EMPTY, finalize, Observable, tap, throwError } from 'rxjs';

/** State of `movimientos`: the list, one movement with its trail, and the review of dotaciones. */
@State<MovimientosStateModel>({ name: 'movimientos', defaults: MOVIMIENTOS_INICIAL })
@Injectable()
export class MovimientosState {
  private readonly servicio = inject(MovimientosService);
  private readonly catalogos = inject(CatalogosService);

  @Selector()
  static pagina(state: MovimientosStateModel): MovimientosPaginaDto | null {
    return state.pagina;
  }

  @Selector()
  static detalle(state: MovimientosStateModel): MovimientoDetalleDto | null {
    return state.detalle;
  }

  @Selector()
  static sucursales(state: MovimientosStateModel): Sucursal[] {
    return state.sucursales;
  }

  @Selector()
  static cargandoLista(state: MovimientosStateModel): boolean {
    return state.cargandoLista;
  }

  @Selector()
  static cargandoDetalle(state: MovimientosStateModel): boolean {
    return state.cargandoDetalle;
  }

  @Selector()
  static exportando(state: MovimientosStateModel): boolean {
    return state.exportando;
  }

  @Selector()
  static guardando(state: MovimientosStateModel): boolean {
    return state.guardando;
  }

  @Selector()
  static errorLista(state: MovimientosStateModel): string | null {
    return state.errorLista;
  }

  @Selector()
  static errorDetalle(state: MovimientosStateModel): string | null {
    return state.errorDetalle;
  }

  @Selector()
  static notFound(state: MovimientosStateModel): boolean {
    return state.notFound;
  }

  @Selector()
  static errorRevision(state: MovimientosStateModel): string | null {
    return state.errorRevision;
  }

  @Action(CargarMovimientos, { cancelUncompleted: true })
  cargarMovimientos(ctx: StateContext<MovimientosStateModel>, { consulta }: CargarMovimientos) {
    ctx.patchState({ cargandoLista: true, errorLista: null });
    return this.servicio.listar(consulta).pipe(
      tap((pagina) => ctx.patchState({ pagina })),
      catchError(() => {
        ctx.patchState({ errorLista: MENSAJE_ERROR_GENERICO });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ cargandoLista: false })),
    );
  }

  @Action(ExportarMovimientos)
  exportarMovimientos(ctx: StateContext<MovimientosStateModel>, { consulta }: ExportarMovimientos) {
    ctx.patchState({ exportando: true, errorLista: null });
    return this.servicio.exportar(consulta).pipe(
      tap((archivo) => this.descargar(archivo, `movimientos-${hoyIso()}.csv`)),
      catchError(() => {
        ctx.patchState({ errorLista: MENSAJE_ERROR_GENERICO });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ exportando: false })),
    );
  }

  @Action(CargarMovimiento, { cancelUncompleted: true })
  cargarMovimiento(ctx: StateContext<MovimientosStateModel>, { id }: CargarMovimiento) {
    ctx.patchState({
      cargandoDetalle: true,
      errorDetalle: null,
      notFound: false,
      errorRevision: null,
      detalle: null,
    });
    return this.servicio.obtener(id).pipe(
      tap((detalle) => ctx.patchState({ detalle })),
      catchError((fallo: unknown) => {
        ctx.patchState({
          errorDetalle: MENSAJE_ERROR_GENERICO,
          notFound: fallo instanceof HttpErrorResponse && fallo.status === 404,
        });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ cargandoDetalle: false })),
    );
  }

  @Action(CargarSucursalesMovimientos)
  cargarSucursales(ctx: StateContext<MovimientosStateModel>) {
    return this.catalogos.sucursales().pipe(
      tap((sucursales) => ctx.patchState({ sucursales })),
      catchError(() => EMPTY),
    );
  }

  @Action(AprobarDotacion)
  aprobarDotacion(
    ctx: StateContext<MovimientosStateModel>,
    { id, usuarioId, montos, comentario }: AprobarDotacion,
  ) {
    return this.revisar(ctx, this.servicio.aprobarDotacion(id, { usuarioId, montos, comentario }));
  }

  @Action(RechazarDotacion)
  rechazarDotacion(
    ctx: StateContext<MovimientosStateModel>,
    { id, usuarioId, motivo }: RechazarDotacion,
  ) {
    return this.revisar(ctx, this.servicio.rechazarDotacion(id, { usuarioId, motivo }));
  }

  @Action(LimpiarErrorRevision)
  limpiarErrorRevision(ctx: StateContext<MovimientosStateModel>): void {
    ctx.patchState({ errorRevision: null });
  }

  /** A refused review keeps its message in state and fails the action, so the page stays where it is. */
  private revisar(
    ctx: StateContext<MovimientosStateModel>,
    solicitud: Observable<MovimientoDetalleDto>,
  ) {
    ctx.patchState({ guardando: true, errorRevision: null });
    return solicitud.pipe(
      tap((detalle) => ctx.patchState({ detalle })),
      catchError((error: HttpErrorResponse) => {
        const codigo: string | undefined = error.error?.codigo;
        ctx.patchState({
          errorRevision: (codigo && MENSAJE_ERROR_REVISION[codigo]) || MENSAJE_ERROR_GENERICO,
        });
        return throwError(() => error);
      }),
      finalize(() => ctx.patchState({ guardando: false })),
    );
  }

  private descargar(archivo: Blob, nombre: string): void {
    const direccion = URL.createObjectURL(archivo);
    const enlace = document.createElement('a');
    enlace.href = direccion;
    enlace.download = nombre;
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(direccion), 0);
  }
}

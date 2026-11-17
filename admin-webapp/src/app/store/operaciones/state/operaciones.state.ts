import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MENSAJE_ERROR_GENERICO } from '@data/constants/autenticacion.constants';
import { OPERACIONES_INICIAL } from '@data/constants/operaciones.constants';
import { Cajero } from '@data/interfaces/cajero';
import { Divisa } from '@data/interfaces/divisa';
import { Sucursal } from '@data/interfaces/sucursal';
import { PaginaDto } from '@data/dto/lista.dto';
import { OperacionDetalleDto, OperacionListaDto } from '@data/dto/operaciones.dto';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { OperacionesService } from '@services/operaciones/operaciones.service';
import { CatalogosService } from '@services/catalogos/catalogos.service';
import {
  CargarCatalogosOperaciones,
  CargarOperacion,
  CargarOperaciones,
} from '@store/operaciones/actions/operaciones.actions';
import { OperacionesStateModel } from '@store/operaciones/types/operaciones.types';
import { catchError, EMPTY, finalize, forkJoin, tap } from 'rxjs';

/** State of `operaciones`: the list page, the open detail and the catalogs the filters offer. */
@State<OperacionesStateModel>({ name: 'operaciones', defaults: OPERACIONES_INICIAL })
@Injectable()
export class OperacionesState {
  private readonly servicio = inject(OperacionesService);
  private readonly catalogos = inject(CatalogosService);

  @Selector()
  static pagina(state: OperacionesStateModel): PaginaDto<OperacionListaDto> | null {
    return state.pagina;
  }

  @Selector()
  static detalle(state: OperacionesStateModel): OperacionDetalleDto | null {
    return state.detalle;
  }

  @Selector()
  static sucursales(state: OperacionesStateModel): Sucursal[] {
    return state.sucursales;
  }

  @Selector()
  static cajeros(state: OperacionesStateModel): Cajero[] {
    return state.cajeros;
  }

  @Selector()
  static divisas(state: OperacionesStateModel): Divisa[] {
    return state.divisas;
  }

  @Selector()
  static noEncontrada(state: OperacionesStateModel): boolean {
    return state.noEncontrada;
  }

  @Selector()
  static cargando(state: OperacionesStateModel): boolean {
    return state.cargando;
  }

  @Selector()
  static error(state: OperacionesStateModel): string | null {
    return state.error;
  }

  @Action(CargarOperaciones, { cancelUncompleted: true })
  cargarOperaciones(ctx: StateContext<OperacionesStateModel>, { consulta }: CargarOperaciones) {
    ctx.patchState({ cargando: true, error: null });
    return this.servicio.listar(consulta).pipe(
      tap((pagina) => ctx.patchState({ pagina })),
      catchError(() => {
        ctx.patchState({ error: MENSAJE_ERROR_GENERICO });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ cargando: false })),
    );
  }

  @Action(CargarOperacion, { cancelUncompleted: true })
  cargarOperacion(ctx: StateContext<OperacionesStateModel>, { id }: CargarOperacion) {
    ctx.patchState({ cargando: true, error: null, detalle: null, noEncontrada: false });
    return this.servicio.obtener(id).pipe(
      tap((detalle) => ctx.patchState({ detalle })),
      catchError((fallo: HttpErrorResponse) => {
        ctx.patchState({ error: MENSAJE_ERROR_GENERICO, noEncontrada: fallo.status === 404 });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ cargando: false })),
    );
  }

  /** Filter options are a convenience: a failure leaves the filters without a whitelist, not the page in error. */
  @Action(CargarCatalogosOperaciones)
  cargarCatalogos(ctx: StateContext<OperacionesStateModel>) {
    return forkJoin({
      sucursales: this.catalogos.sucursales(),
      cajeros: this.catalogos.cajeros(),
      divisas: this.catalogos.divisas(),
    }).pipe(
      tap((catalogos) => ctx.patchState(catalogos)),
      catchError(() => EMPTY),
    );
  }
}

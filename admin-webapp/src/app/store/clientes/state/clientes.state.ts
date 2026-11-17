import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MENSAJE_ERROR_GENERICO } from '@data/constants/autenticacion.constants';
import { CLIENTES_INICIAL } from '@data/constants/clientes.constants';
import { ClienteDetalleDto } from '@data/dto/clientes.dto';
import { ClienteOperacionesDto } from '@data/dto/clientes-operaciones.dto';
import { PaginaDto } from '@data/dto/lista.dto';
import { ClienteResumen } from '@data/interfaces/cliente-resumen';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ClientesService } from '@services/clientes/clientes.service';
import {
  CargarCliente,
  CargarClienteOperaciones,
  CargarClientes,
} from '@store/clientes/actions/clientes.actions';
import { ClientesStateModel } from '@store/clientes/types/clientes.types';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

/** State of `clientes` (read-only this ola): the list page, the open cliente and its operaciones. */
@State<ClientesStateModel>({ name: 'clientes', defaults: CLIENTES_INICIAL })
@Injectable()
export class ClientesState {
  private readonly servicio = inject(ClientesService);

  @Selector()
  static pagina(state: ClientesStateModel): PaginaDto<ClienteResumen> | null {
    return state.pagina;
  }

  @Selector()
  static detalle(state: ClientesStateModel): ClienteDetalleDto | null {
    return state.detalle;
  }

  @Selector()
  static operaciones(state: ClientesStateModel): ClienteOperacionesDto | null {
    return state.operaciones;
  }

  @Selector()
  static cargandoOperaciones(state: ClientesStateModel): boolean {
    return state.cargandoOperaciones;
  }

  @Selector()
  static errorOperaciones(state: ClientesStateModel): string | null {
    return state.errorOperaciones;
  }

  @Selector()
  static detalleNoEncontrado(state: ClientesStateModel): boolean {
    return state.detalleNoEncontrado;
  }

  @Selector()
  static cargando(state: ClientesStateModel): boolean {
    return state.cargando;
  }

  @Selector()
  static error(state: ClientesStateModel): string | null {
    return state.error;
  }

  @Action(CargarClientes, { cancelUncompleted: true })
  cargarClientes(ctx: StateContext<ClientesStateModel>, { consulta }: CargarClientes) {
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

  @Action(CargarCliente, { cancelUncompleted: true })
  cargarCliente(ctx: StateContext<ClientesStateModel>, { id }: CargarCliente) {
    ctx.patchState({ cargando: true, error: null, detalleNoEncontrado: false, detalle: null });
    return this.servicio.obtener(id).pipe(
      tap((detalle) => ctx.patchState({ detalle })),
      catchError((respuesta: HttpErrorResponse) => {
        ctx.patchState(
          respuesta.status === 404
            ? { detalleNoEncontrado: true }
            : { error: MENSAJE_ERROR_GENERICO },
        );
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ cargando: false })),
    );
  }

  @Action(CargarClienteOperaciones, { cancelUncompleted: true })
  cargarClienteOperaciones(
    ctx: StateContext<ClientesStateModel>,
    { id }: CargarClienteOperaciones,
  ) {
    ctx.patchState({ cargandoOperaciones: true, operaciones: null, errorOperaciones: null });
    return this.servicio.operaciones(id).pipe(
      tap((operaciones) => ctx.patchState({ operaciones })),
      catchError(() => {
        ctx.patchState({ errorOperaciones: MENSAJE_ERROR_GENERICO });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ cargandoOperaciones: false })),
    );
  }
}

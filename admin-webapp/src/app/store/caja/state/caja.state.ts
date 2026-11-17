import { inject, Injectable } from '@angular/core';
import { MENSAJE_ERROR_GENERICO } from '@data/constants/autenticacion.constants';
import { CAJA_INICIAL } from '@data/constants/caja.constants';
import { CajasPaginaDto, ConteosPaginaDto } from '@data/dto/caja-pagina.dto';
import { OpcionFiltro } from '@data/interfaces/opcion-filtro';
import { Sucursal } from '@data/interfaces/sucursal';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CajaService } from '@services/caja/caja.service';
import { CatalogosService } from '@services/catalogos/catalogos.service';
import {
  CargarCajas,
  CargarConteos,
  CargarOpcionesCajas,
  CargarSucursalesCaja,
} from '@store/caja/actions/caja.actions';
import { CajaStateModel } from '@store/caja/types/caja.types';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

/** State of `caja`: the cajas list, the conteos list and the sucursal catalog their filters use. */
@State<CajaStateModel>({ name: 'caja', defaults: CAJA_INICIAL })
@Injectable()
export class CajaState {
  private readonly servicio = inject(CajaService);
  private readonly catalogos = inject(CatalogosService);

  @Selector()
  static cajas(state: CajaStateModel): CajasPaginaDto | null {
    return state.cajas;
  }

  @Selector()
  static conteos(state: CajaStateModel): ConteosPaginaDto | null {
    return state.conteos;
  }

  @Selector()
  static sucursales(state: CajaStateModel): Sucursal[] {
    return state.sucursales;
  }

  @Selector()
  static opcionesCajas(state: CajaStateModel): OpcionFiltro[] {
    return state.opcionesCajas;
  }

  @Selector()
  static cargandoCajas(state: CajaStateModel): boolean {
    return state.cargandoCajas;
  }

  @Selector()
  static cargandoConteos(state: CajaStateModel): boolean {
    return state.cargandoConteos;
  }

  @Selector()
  static errorCajas(state: CajaStateModel): string | null {
    return state.errorCajas;
  }

  @Selector()
  static errorConteos(state: CajaStateModel): string | null {
    return state.errorConteos;
  }

  @Action(CargarCajas, { cancelUncompleted: true })
  cargarCajas(ctx: StateContext<CajaStateModel>, { consulta }: CargarCajas) {
    ctx.patchState({ cargandoCajas: true, errorCajas: null });
    return this.servicio.listar(consulta).pipe(
      tap((cajas) => ctx.patchState({ cajas })),
      catchError(() => {
        ctx.patchState({ errorCajas: MENSAJE_ERROR_GENERICO });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ cargandoCajas: false })),
    );
  }

  @Action(CargarConteos, { cancelUncompleted: true })
  cargarConteos(ctx: StateContext<CajaStateModel>, { consulta }: CargarConteos) {
    ctx.patchState({ cargandoConteos: true, errorConteos: null });
    return this.servicio.listarConteos(consulta).pipe(
      tap((conteos) => ctx.patchState({ conteos })),
      catchError(() => {
        ctx.patchState({ errorConteos: MENSAJE_ERROR_GENERICO });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ cargandoConteos: false })),
    );
  }

  @Action(CargarSucursalesCaja)
  cargarSucursales(ctx: StateContext<CajaStateModel>) {
    return this.catalogos.sucursales().pipe(
      tap((sucursales) => ctx.patchState({ sucursales })),
      catchError(() => EMPTY),
    );
  }

  @Action(CargarOpcionesCajas)
  cargarOpcionesCajas(ctx: StateContext<CajaStateModel>) {
    if (ctx.getState().opcionesCajas.length > 0) return;
    return this.servicio.opciones().pipe(
      tap((opcionesCajas) => ctx.patchState({ opcionesCajas })),
      catchError(() => EMPTY),
    );
  }
}

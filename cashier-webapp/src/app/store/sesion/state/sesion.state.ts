import { Injectable } from '@angular/core';
import { ETIQUETA_ROL } from '@data/constants/rol.constants';
import { SESION_INICIAL } from '@data/constants/sesion.constants';
import { UsuarioSesionDto } from '@data/dto/autenticacion.dto';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CerrarSesion, EstablecerSesion } from '@store/sesion/actions/sesion.actions';
import { SesionStateModel } from '@store/sesion/types/sesion.types';
import { iniciales } from '@utils/texto/iniciales';

/** The signed-in usuario. No guards read it yet (plans/00: routes stay open until Phase 2). */
@State<SesionStateModel>({ name: 'sesion', defaults: SESION_INICIAL })
@Injectable()
export class SesionState {
  @Selector()
  static usuario(state: SesionStateModel): UsuarioSesionDto | null {
    return state.sesion?.usuario ?? null;
  }

  @Selector()
  static iniciada(state: SesionStateModel): boolean {
    return state.sesion !== null;
  }

  @Selector()
  static nombreCompleto(state: SesionStateModel): string {
    const usuario = state.sesion?.usuario;
    return usuario ? `${usuario.nombre} ${usuario.apellidos}`.trim() : '';
  }

  @Selector()
  static iniciales(state: SesionStateModel): string {
    const usuario = state.sesion?.usuario;
    return usuario ? iniciales(`${usuario.nombre} ${usuario.apellidos}`) : '';
  }

  @Selector()
  static etiquetaRol(state: SesionStateModel): string {
    const rol = state.sesion?.usuario.rol;
    return rol ? ETIQUETA_ROL[rol] : '';
  }

  @Action(EstablecerSesion)
  establecer(ctx: StateContext<SesionStateModel>, { sesion }: EstablecerSesion): void {
    ctx.setState({ sesion });
  }

  @Action(CerrarSesion)
  cerrar(ctx: StateContext<SesionStateModel>): void {
    ctx.setState(SESION_INICIAL);
  }
}

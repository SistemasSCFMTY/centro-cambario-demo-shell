import { inject, Injectable } from '@angular/core';
import { AUTENTICACION_INICIAL } from '@data/constants/autenticacion.constants';
import { RetoOtpDto } from '@data/dto/autenticacion.dto';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AutenticacionService } from '@services/autenticacion/autenticacion.service';
import {
  CancelarVerificacion,
  IniciarSesion,
  LimpiarErrorAutenticacion,
  ReenviarCodigo,
  VerificarCodigo,
} from '@store/autenticacion/actions/autenticacion.actions';
import { AutenticacionStateModel } from '@store/autenticacion/types/autenticacion.types';
import { CerrarSesion, EstablecerSesion } from '@store/sesion/actions/sesion.actions';
import { mensajeDeError } from '@utils/autenticacion/error-autenticacion';
import { catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';

/** The login → OTP flow. Refusals land in `error`; the actions complete either way. */
@State<AutenticacionStateModel>({ name: 'autenticacion', defaults: AUTENTICACION_INICIAL })
@Injectable()
export class AutenticacionState {
  private readonly servicio = inject(AutenticacionService);

  @Selector()
  static reto(state: AutenticacionStateModel): RetoOtpDto | null {
    return state.reto;
  }

  @Selector()
  static enviando(state: AutenticacionStateModel): boolean {
    return state.enviando;
  }

  @Selector()
  static reenviando(state: AutenticacionStateModel): boolean {
    return state.reenviando;
  }

  @Selector()
  static error(state: AutenticacionStateModel): string | null {
    return state.error;
  }

  @Action(IniciarSesion)
  iniciarSesion(ctx: StateContext<AutenticacionStateModel>, { credenciales }: IniciarSesion) {
    ctx.patchState({ enviando: true, error: null, reto: null });
    return this.servicio.iniciarSesion(credenciales).pipe(
      tap((reto) => ctx.patchState({ reto })),
      catchError((error) => {
        ctx.patchState({ error: mensajeDeError(error) });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ enviando: false })),
    );
  }

  @Action(VerificarCodigo)
  verificarCodigo(ctx: StateContext<AutenticacionStateModel>, { codigo }: VerificarCodigo) {
    const reto = ctx.getState().reto;
    if (!reto) return EMPTY;
    ctx.patchState({ enviando: true, error: null });
    return this.servicio.verificarCodigo(reto.idReto, codigo).pipe(
      switchMap((sesion) => {
        ctx.patchState({ reto: null });
        return ctx.dispatch(new EstablecerSesion(sesion));
      }),
      catchError((error) => {
        ctx.patchState({ error: mensajeDeError(error) });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ enviando: false })),
    );
  }

  @Action(ReenviarCodigo)
  reenviarCodigo(ctx: StateContext<AutenticacionStateModel>) {
    const reto = ctx.getState().reto;
    if (!reto) return EMPTY;
    ctx.patchState({ reenviando: true, error: null });
    return this.servicio.reenviarCodigo(reto.idReto).pipe(
      tap((nuevo) => ctx.patchState({ reto: nuevo })),
      catchError((error) => {
        ctx.patchState({ error: mensajeDeError(error) });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ reenviando: false })),
    );
  }

  @Action(LimpiarErrorAutenticacion)
  limpiarError(ctx: StateContext<AutenticacionStateModel>): void {
    if (ctx.getState().error) ctx.patchState({ error: null });
  }

  @Action([CancelarVerificacion, CerrarSesion])
  reiniciar(ctx: StateContext<AutenticacionStateModel>): void {
    ctx.setState(AUTENTICACION_INICIAL);
  }
}

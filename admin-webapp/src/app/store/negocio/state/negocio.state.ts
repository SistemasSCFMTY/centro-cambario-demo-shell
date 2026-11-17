import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MENSAJE_ERROR_GENERICO } from '@data/constants/autenticacion.constants';
import {
  MENSAJE_ERROR_NEGOCIO,
  MENSAJE_NEGOCIO_GUARDADO,
  MENSAJE_SUCURSAL_ACTUALIZADA,
  MENSAJE_SUCURSAL_BAJA,
  MENSAJE_SUCURSAL_CREADA,
  MENSAJE_SUCURSAL_REACTIVADA,
  NEGOCIO_INICIAL,
} from '@data/constants/negocio.constants';
import { PaginaDto } from '@data/dto/lista.dto';
import { PerfilNegocioDto } from '@data/dto/negocio-perfil.dto';
import { OpcionCatalogo } from '@data/interfaces/opcion-catalogo';
import { OpcionesNegocio } from '@data/interfaces/opciones-negocio';
import { RegistroAuditoria } from '@data/interfaces/registro-auditoria';
import { SucursalResumen } from '@data/interfaces/sucursal-resumen-negocio';
import { CodigoErrorNegocio } from '@data/types/negocio.types';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { toast } from '@spartan-ng/brain/sonner';
import { CatalogosService } from '@services/catalogos/catalogos.service';
import { NegocioService } from '@services/negocio/negocio.service';
import {
  CambiarEstatusSucursal,
  CargarAuditoriaNegocio,
  CargarLocalidadesNegocio,
  CargarMunicipiosNegocio,
  CargarNegocio,
  CargarOpcionesNegocio,
  CargarSucursal,
  CargarSucursales,
  GuardarNegocio,
  GuardarSucursal,
  LimpiarErrorGuardadoNegocio,
} from '@store/negocio/actions/negocio.actions';
import { NegocioStateModel } from '@store/negocio/types/negocio.types';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

/** State of `negocio`: the profile, its legal data, the sucursales and the audit trail. */
@State<NegocioStateModel>({ name: 'negocio', defaults: NEGOCIO_INICIAL })
@Injectable()
export class NegocioState {
  private readonly servicio = inject(NegocioService);
  private readonly catalogos = inject(CatalogosService);

  @Selector()
  static perfil(state: NegocioStateModel): PerfilNegocioDto | null {
    return state.perfil;
  }

  @Selector()
  static opciones(state: NegocioStateModel): OpcionesNegocio | null {
    return state.opciones;
  }

  @Selector()
  static municipios(state: NegocioStateModel): OpcionCatalogo[] {
    return state.municipios;
  }

  @Selector()
  static localidades(state: NegocioStateModel): OpcionCatalogo[] {
    return state.localidades;
  }

  @Selector()
  static auditoria(state: NegocioStateModel): RegistroAuditoria[] {
    return state.auditoria;
  }

  @Selector()
  static sucursales(state: NegocioStateModel): PaginaDto<SucursalResumen> | null {
    return state.sucursales;
  }

  @Selector()
  static sucursal(state: NegocioStateModel): SucursalResumen | null {
    return state.sucursal;
  }

  @Selector()
  static cargando(state: NegocioStateModel): boolean {
    return state.cargando;
  }

  @Selector()
  static cargandoAuditoria(state: NegocioStateModel): boolean {
    return state.cargandoAuditoria;
  }

  @Selector()
  static cargandoSucursales(state: NegocioStateModel): boolean {
    return state.cargandoSucursales;
  }

  @Selector()
  static cargandoSucursal(state: NegocioStateModel): boolean {
    return state.cargandoSucursal;
  }

  @Selector()
  static guardando(state: NegocioStateModel): boolean {
    return state.guardando;
  }

  @Selector()
  static errorPerfil(state: NegocioStateModel): string | null {
    return state.errorPerfil;
  }

  @Selector()
  static errorOpciones(state: NegocioStateModel): string | null {
    return state.errorOpciones;
  }

  @Selector()
  static cargandoGeografia(state: NegocioStateModel): boolean {
    return state.cargandoGeografia;
  }

  @Selector()
  static errorGeografia(state: NegocioStateModel): string | null {
    return state.errorGeografia;
  }

  @Selector()
  static errorAuditoria(state: NegocioStateModel): string | null {
    return state.errorAuditoria;
  }

  @Selector()
  static errorSucursales(state: NegocioStateModel): string | null {
    return state.errorSucursales;
  }

  @Selector()
  static errorSucursal(state: NegocioStateModel): string | null {
    return state.errorSucursal;
  }

  @Selector()
  static errorGuardado(state: NegocioStateModel): string | null {
    return state.errorGuardado;
  }

  @Action(CargarNegocio, { cancelUncompleted: true })
  cargarNegocio(ctx: StateContext<NegocioStateModel>) {
    ctx.patchState({ cargando: true, errorPerfil: null });
    return this.servicio.obtener().pipe(
      tap((perfil) => ctx.patchState({ perfil })),
      catchError(() => {
        ctx.patchState({ errorPerfil: MENSAJE_ERROR_GENERICO });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ cargando: false })),
    );
  }

  @Action(CargarOpcionesNegocio, { cancelUncompleted: true })
  cargarOpciones(ctx: StateContext<NegocioStateModel>) {
    ctx.patchState({ errorOpciones: null });
    return this.servicio.opciones().pipe(
      tap((opciones) => ctx.patchState({ opciones })),
      catchError(() => {
        ctx.patchState({ errorOpciones: MENSAJE_ERROR_GENERICO });
        return EMPTY;
      }),
    );
  }

  @Action(CargarMunicipiosNegocio, { cancelUncompleted: true })
  cargarMunicipios(ctx: StateContext<NegocioStateModel>, { entidad }: CargarMunicipiosNegocio) {
    ctx.patchState({ municipios: [], errorGeografia: null, cargandoGeografia: !!entidad });
    if (!entidad) return EMPTY;
    return this.catalogos.municipios(entidad).pipe(
      tap((municipios) => ctx.patchState({ municipios, cargandoGeografia: false })),
      catchError(() => {
        ctx.patchState({
          municipios: [],
          cargandoGeografia: false,
          errorGeografia: MENSAJE_ERROR_GENERICO,
        });
        return EMPTY;
      }),
    );
  }

  @Action(CargarLocalidadesNegocio, { cancelUncompleted: true })
  cargarLocalidades(
    ctx: StateContext<NegocioStateModel>,
    { entidad, municipio }: CargarLocalidadesNegocio,
  ) {
    const carga = !!entidad && !!municipio;
    ctx.patchState({ localidades: [], errorGeografia: null, cargandoGeografia: carga });
    if (!carga) return EMPTY;
    return this.catalogos.localidades(entidad, municipio).pipe(
      tap((localidades) => ctx.patchState({ localidades, cargandoGeografia: false })),
      catchError(() => {
        ctx.patchState({
          localidades: [],
          cargandoGeografia: false,
          errorGeografia: MENSAJE_ERROR_GENERICO,
        });
        return EMPTY;
      }),
    );
  }

  @Action(CargarAuditoriaNegocio, { cancelUncompleted: true })
  cargarAuditoria(ctx: StateContext<NegocioStateModel>) {
    ctx.patchState({ cargandoAuditoria: true, errorAuditoria: null });
    return this.servicio.auditoria().pipe(
      tap((auditoria) => ctx.patchState({ auditoria })),
      catchError(() => {
        ctx.patchState({ errorAuditoria: MENSAJE_ERROR_GENERICO });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ cargandoAuditoria: false })),
    );
  }

  @Action(CargarSucursales, { cancelUncompleted: true })
  cargarSucursales(ctx: StateContext<NegocioStateModel>, { consulta }: CargarSucursales) {
    ctx.patchState({ cargandoSucursales: true, errorSucursales: null });
    return this.servicio.listarSucursales(consulta).pipe(
      tap((sucursales) => ctx.patchState({ sucursales })),
      catchError(() => {
        ctx.patchState({ errorSucursales: MENSAJE_ERROR_GENERICO });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ cargandoSucursales: false })),
    );
  }

  @Action(CargarSucursal, { cancelUncompleted: true })
  cargarSucursal(ctx: StateContext<NegocioStateModel>, { id }: CargarSucursal) {
    ctx.patchState({ cargandoSucursal: true, errorSucursal: null, sucursal: null });
    return this.servicio.obtenerSucursal(id).pipe(
      tap((sucursal) => ctx.patchState({ sucursal })),
      catchError((error: unknown) => {
        const noExiste = error instanceof HttpErrorResponse && error.status === 404;
        ctx.patchState({
          errorSucursal: noExiste
            ? MENSAJE_ERROR_NEGOCIO.SUCURSAL_NO_ENCONTRADA
            : MENSAJE_ERROR_GENERICO,
        });
        return EMPTY;
      }),
      finalize(() => ctx.patchState({ cargandoSucursal: false })),
    );
  }

  @Action(GuardarNegocio)
  guardarNegocio(ctx: StateContext<NegocioStateModel>, { datos }: GuardarNegocio) {
    ctx.patchState({ guardando: true, errorGuardado: null });
    return this.servicio.guardar(datos).pipe(
      tap((perfil) => {
        ctx.patchState({ perfil });
        toast.success(MENSAJE_NEGOCIO_GUARDADO);
      }),
      catchError((error: unknown) => this.rechazado(ctx, error)),
      finalize(() => ctx.patchState({ guardando: false })),
    );
  }

  @Action(GuardarSucursal)
  guardarSucursal(ctx: StateContext<NegocioStateModel>, { datos, id }: GuardarSucursal) {
    ctx.patchState({ guardando: true, errorGuardado: null });
    const llamada = id
      ? this.servicio.actualizarSucursal(id, datos)
      : this.servicio.crearSucursal(datos);
    return llamada.pipe(
      tap(() => toast.success(id ? MENSAJE_SUCURSAL_ACTUALIZADA : MENSAJE_SUCURSAL_CREADA)),
      catchError((error: unknown) => this.rechazado(ctx, error)),
      finalize(() => ctx.patchState({ guardando: false })),
    );
  }

  @Action(CambiarEstatusSucursal)
  cambiarEstatusSucursal(
    ctx: StateContext<NegocioStateModel>,
    { id, activa }: CambiarEstatusSucursal,
  ) {
    ctx.patchState({ guardando: true, errorGuardado: null });
    return this.servicio.cambiarEstatusSucursal(id, activa).pipe(
      tap(() => toast.success(activa ? MENSAJE_SUCURSAL_REACTIVADA : MENSAJE_SUCURSAL_BAJA)),
      catchError((error: unknown) => this.rechazado(ctx, error)),
      finalize(() => ctx.patchState({ guardando: false })),
    );
  }

  @Action(LimpiarErrorGuardadoNegocio)
  limpiarErrorGuardado(ctx: StateContext<NegocioStateModel>) {
    ctx.patchState({ errorGuardado: null });
  }

  /** Turns a refused change into the message the form shows. */
  private rechazado(ctx: StateContext<NegocioStateModel>, error: unknown) {
    const cuerpo = error instanceof HttpErrorResponse ? error.error : null;
    const codigo = cuerpo?.codigo as CodigoErrorNegocio | undefined;
    const plantilla = codigo ? MENSAJE_ERROR_NEGOCIO[codigo] : undefined;
    ctx.patchState({
      errorGuardado: plantilla
        ? plantilla.replace('{valor}', String(cuerpo?.valor ?? ''))
        : MENSAJE_ERROR_GENERICO,
    });
    return EMPTY;
  }
}

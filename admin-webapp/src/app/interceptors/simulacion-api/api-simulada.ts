import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RUTAS_API } from '@data/constants/api.constants';
import {
  LONGITUD_CODIGO,
  MINUTOS_VIGENCIA_RETO,
  SEGUNDOS_ESPERA_REENVIO,
} from '@data/constants/autenticacion.constants';
import {
  CredencialesDto,
  ReenvioDto,
  RetoOtpDto,
  SesionDto,
  VerificacionDto,
} from '@data/dto/autenticacion.dto';
import { MARCA_DEMO } from '@data/fixtures/marca.fixture';
import { CODIGO_OTP_PRUEBA, USUARIOS_PRUEBA } from '@data/fixtures/usuarios.fixture';
import { RetoPendiente } from '@data/interfaces/reto-pendiente';
import { CodigoErrorAutenticacion } from '@data/types/autenticacion.types';
import { RespuestaSimulada } from '@data/types/simulacion.types';
import { MANEJADORES } from '@interceptors/simulacion-api/manejadores/manejadores';
import { enmascararCorreo } from '@utils/autenticacion/error-autenticacion';

/**
 * **Phase 1 only:** a stand-in for backend-api, answered in the browser (plans/00). It plays the
 * server's part for branding and for login → OTP → session against the two test users, and hands
 * every module's routes to its handler in `manejadores/`, so the
 * services stay thin HTTP and the states never know. Its pending OTP steps are the server's memory,
 * not app state. Phase 2 deletes this folder and the interceptor line in app.config.ts.
 */
@Injectable({ providedIn: 'root' })
export class ApiSimulada {
  private readonly retos = new Map<string, RetoPendiente>();

  /** The response for a request under URL_API (possibly still loading), or null for a route it doesn't know. */
  responder(solicitud: HttpRequest<unknown>): RespuestaSimulada | null {
    switch (solicitud.url) {
      case RUTAS_API.marca:
        return this.ok(solicitud, MARCA_DEMO);
      case RUTAS_API.inicioSesion:
        return this.iniciarSesion(solicitud as HttpRequest<CredencialesDto>);
      case RUTAS_API.verificacion:
        return this.verificarCodigo(solicitud as HttpRequest<VerificacionDto>);
      case RUTAS_API.reenvio:
        return this.reenviarCodigo(solicitud as HttpRequest<ReenvioDto>);
      default:
        return this.delegar(solicitud);
    }
  }

  /** The module handlers (`manejadores/`), in order; null when none of them owns the route. */
  private delegar(solicitud: HttpRequest<unknown>): RespuestaSimulada | null {
    for (const manejador of MANEJADORES) {
      const respuesta = manejador.responder(solicitud);
      if (respuesta) return respuesta;
    }
    return null;
  }

  private iniciarSesion(solicitud: HttpRequest<CredencialesDto>): HttpResponse<RetoOtpDto> {
    const { correo, contrasena } = solicitud.body!;
    const usuario = USUARIOS_PRUEBA.find(
      (u) => u.correo === correo.trim().toLowerCase() && u.contrasena === contrasena,
    );
    if (!usuario) this.rechazar(solicitud, 401, 'CREDENCIALES_INVALIDAS');
    const reto = this.nuevoReto(usuario.correo, crypto.randomUUID());
    this.retos.set(reto.idReto, { idUsuario: usuario.id, reto });
    return this.ok(solicitud, reto);
  }

  private verificarCodigo(solicitud: HttpRequest<VerificacionDto>): HttpResponse<SesionDto> {
    const { idReto, codigo } = solicitud.body!;
    const pendiente = this.vigente(solicitud, idReto);
    if (codigo !== CODIGO_OTP_PRUEBA) this.rechazar(solicitud, 401, 'CODIGO_INVALIDO');
    this.retos.delete(idReto);
    const { contrasena: _, ...usuario } = USUARIOS_PRUEBA.find(
      (u) => u.id === pendiente.idUsuario,
    )!;
    return this.ok(solicitud, { usuario, token: crypto.randomUUID() });
  }

  private reenviarCodigo(solicitud: HttpRequest<ReenvioDto>): HttpResponse<RetoOtpDto> {
    const { idReto } = solicitud.body!;
    const pendiente = this.vigente(solicitud, idReto);
    if (pendiente.reto.reenvioDisponibleEn > Date.now()) {
      this.rechazar(solicitud, 429, 'REENVIO_ANTICIPADO');
    }
    const usuario = USUARIOS_PRUEBA.find((u) => u.id === pendiente.idUsuario)!;
    const reto = this.nuevoReto(usuario.correo, idReto);
    this.retos.set(idReto, { idUsuario: usuario.id, reto });
    return this.ok(solicitud, reto);
  }

  /** The pending step, or a refusal when it's unknown or expired. */
  private vigente(solicitud: HttpRequest<unknown>, idReto: string): RetoPendiente {
    const pendiente = this.retos.get(idReto);
    if (!pendiente || pendiente.reto.expiraEn < Date.now()) {
      this.rechazar(solicitud, 401, 'RETO_EXPIRADO');
    }
    return pendiente;
  }

  private nuevoReto(correo: string, idReto: string): RetoOtpDto {
    const ahora = Date.now();
    return {
      idReto,
      correoEnmascarado: enmascararCorreo(correo),
      longitudCodigo: LONGITUD_CODIGO,
      reenvioDisponibleEn: ahora + SEGUNDOS_ESPERA_REENVIO * 1000,
      expiraEn: ahora + MINUTOS_VIGENCIA_RETO * 60_000,
    };
  }

  private ok<T>(solicitud: HttpRequest<unknown>, body: T): HttpResponse<T> {
    return new HttpResponse({ status: 200, url: solicitud.url, body });
  }

  private rechazar(
    solicitud: HttpRequest<unknown>,
    status: number,
    codigo: CodigoErrorAutenticacion,
  ): never {
    throw new HttpErrorResponse({ status, url: solicitud.url, error: { codigo } });
  }
}

import { CredencialesDto } from '@data/dto/autenticacion.dto';

/** Email + password. On success the OTP step starts (`reto`). */
export class IniciarSesion {
  static readonly type = '[Autenticacion] Iniciar sesión';
  constructor(readonly credenciales: CredencialesDto) {}
}

/** The code for the step in progress. On success the session starts. */
export class VerificarCodigo {
  static readonly type = '[Autenticacion] Verificar código';
  constructor(readonly codigo: string) {}
}

export class ReenviarCodigo {
  static readonly type = '[Autenticacion] Reenviar código';
}

/** Leaves the OTP step (e.g. "Usar otra cuenta"). */
export class CancelarVerificacion {
  static readonly type = '[Autenticacion] Cancelar verificación';
}

/** The user started typing again: the last refusal no longer applies. */
export class LimpiarErrorAutenticacion {
  static readonly type = '[Autenticacion] Limpiar error';
}

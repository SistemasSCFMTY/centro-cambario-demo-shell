import { SesionDto } from '@data/dto/autenticacion.dto';

/** The OTP step succeeded. */
export class EstablecerSesion {
  static readonly type = '[Sesion] Establecer';
  constructor(readonly sesion: SesionDto) {}
}

export class CerrarSesion {
  static readonly type = '[Sesion] Cerrar';
}

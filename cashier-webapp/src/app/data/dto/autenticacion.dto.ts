import { Rol } from '@data/types/rol.types';
import { CodigoErrorAutenticacion } from '@data/types/autenticacion.types';

export interface CredencialesDto {
  correo: string;
  contrasena: string;
}

/** The OTP step started by a correct email + password. */
export interface RetoOtpDto {
  idReto: string;
  correoEnmascarado: string;
  longitudCodigo: number;
  /** When a resend is allowed (epoch ms). */
  reenvioDisponibleEn: number;
  /** When the step expires (epoch ms). */
  expiraEn: number;
}

export interface UsuarioSesionDto {
  id: string;
  nombre: string;
  apellidos: string;
  correo: string;
  rol: Rol;
}

export interface SesionDto {
  usuario: UsuarioSesionDto;
  token: string;
}

export interface VerificacionDto {
  idReto: string;
  codigo: string;
}

export interface ReenvioDto {
  idReto: string;
}

/** The body of a refused auth request. */
export interface ErrorAutenticacionDto {
  codigo: CodigoErrorAutenticacion;
}

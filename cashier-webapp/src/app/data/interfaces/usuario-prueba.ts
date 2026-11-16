import { UsuarioSesionDto } from '@data/dto/autenticacion.dto';

/** Phase 1: a test user as the simulated API checks it. */
export interface UsuarioPrueba extends UsuarioSesionDto {
  contrasena: string;
}

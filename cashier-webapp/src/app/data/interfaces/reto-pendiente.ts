import { RetoOtpDto } from '@data/dto/autenticacion.dto';

/** Phase 1: an OTP step the simulated API is waiting on. */
export interface RetoPendiente {
  idUsuario: string;
  reto: RetoOtpDto;
}

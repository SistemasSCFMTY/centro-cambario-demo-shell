import { RetoOtpDto } from '@data/dto/autenticacion.dto';

export interface AutenticacionStateModel {
  /** The OTP step in progress; null before login or after it ends. */
  reto: RetoOtpDto | null;
  /** Login or code check in flight. */
  enviando: boolean;
  reenviando: boolean;
  /** Why the last step was refused, as shown on the page. */
  error: string | null;
}

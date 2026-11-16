import { HttpErrorResponse } from '@angular/common/http';
import {
  MENSAJE_ERROR_AUTENTICACION,
  MENSAJE_ERROR_GENERICO,
} from '@data/constants/autenticacion.constants';

/** The page's message for a failed auth request: the API's refusal code, or a generic retry. */
export function mensajeDeError(error: unknown): string {
  const codigo = error instanceof HttpErrorResponse ? error.error?.codigo : undefined;
  return typeof codigo === 'string' && codigo in MENSAJE_ERROR_AUTENTICACION
    ? MENSAJE_ERROR_AUTENTICACION[codigo as keyof typeof MENSAJE_ERROR_AUTENTICACION]
    : MENSAJE_ERROR_GENERICO;
}

/** `eduardo@testing.com` → `e•••••o@testing.com`. */
export function enmascararCorreo(correo: string): string {
  const [local, dominio] = correo.split('@');
  if (!dominio || local.length < 3) return correo;
  return `${local[0]}${'•'.repeat(Math.min(local.length - 2, 6))}${local.at(-1)}@${dominio}`;
}

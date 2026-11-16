import { CodigoErrorAutenticacion } from '@data/types/autenticacion.types';
import { AutenticacionStateModel } from '@store/autenticacion/types/autenticacion.types';

export const LONGITUD_CODIGO = 4;

/** Seconds before another code can be requested. */
export const SEGUNDOS_ESPERA_REENVIO = 30;

/** Minutes an OTP step stays valid. */
export const MINUTOS_VIGENCIA_RETO = 10;

export const MENSAJE_ERROR_AUTENTICACION: Record<CodigoErrorAutenticacion, string> = {
  CREDENCIALES_INVALIDAS: 'El correo o la contraseña no son correctos.',
  CODIGO_INVALIDO: 'El código no es correcto. Revíselo e inténtelo de nuevo.',
  RETO_EXPIRADO: 'La verificación expiró. Inicie sesión de nuevo.',
  REENVIO_ANTICIPADO: 'Espere unos segundos antes de pedir otro código.',
};

/** Any other failure (network, server). */
export const MENSAJE_ERROR_GENERICO = 'No pudimos completar la solicitud. Inténtelo de nuevo.';

export const AUTENTICACION_INICIAL: AutenticacionStateModel = {
  reto: null,
  enviando: false,
  reenviando: false,
  error: null,
};

import { DomicilioEnLinea } from '@data/interfaces/domicilio-en-linea';

/** `Avenida Constitución 1450, Local 3, Centro, Monterrey`: empty parts are skipped. */
export function domicilioEnLinea(domicilio: DomicilioEnLinea): string {
  const calle = [domicilio.calle, domicilio.numeroExterior].filter((p) => p?.trim()).join(' ');
  return [calle, domicilio.numeroInterior, domicilio.colonia, domicilio.municipio]
    .map((parte) => parte?.trim())
    .filter((parte) => !!parte)
    .join(', ');
}

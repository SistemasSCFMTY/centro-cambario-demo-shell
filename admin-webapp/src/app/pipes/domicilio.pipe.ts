import { Pipe, PipeTransform } from '@angular/core';
import { DomicilioEnLinea } from '@data/interfaces/domicilio-en-linea';
import { domicilioEnLinea } from '@utils/negocio/domicilio';

/** A sucursal's structured address as one line: `Avenida Constitución 1450, Centro, Monterrey`. */
@Pipe({ name: 'appDomicilio' })
export class DomicilioPipe implements PipeTransform {
  transform(valor: DomicilioEnLinea): string {
    return domicilioEnLinea(valor);
  }
}

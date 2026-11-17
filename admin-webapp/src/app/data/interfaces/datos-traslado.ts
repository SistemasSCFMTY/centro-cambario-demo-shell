/** The transport record of a traslado de valores (plans/02 round 2). */
export interface DatosTraslado {
  empresaTransporte: string;
  guardia: string;
  vehiculo: string;
  /** Seal or bag number. */
  marchamo: string;
  /** Local ISO date-time of the pickup. */
  recoleccionEn: string;
  /** Local ISO date-time of the delivery; null while the cash is still on the road. */
  entregaEn: string | null;
}

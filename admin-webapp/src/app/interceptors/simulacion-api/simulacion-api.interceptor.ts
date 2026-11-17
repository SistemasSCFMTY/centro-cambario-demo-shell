import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LATENCIA_SIMULADA_MS, URL_API } from '@data/constants/api.constants';
import { ApiSimulada } from '@interceptors/simulacion-api/api-simulada';
import { defer, delay, dematerialize, from, materialize, of, throwError } from 'rxjs';

/** Phase 1: answers backend-api requests in the browser (see ApiSimulada), after a short delay. */
export const simulacionApiInterceptor: HttpInterceptorFn = (solicitud, siguiente) => {
  if (!solicitud.url.startsWith(URL_API)) return siguiente(solicitud);
  const api = inject(ApiSimulada);
  return defer(() => {
    try {
      const respuesta = api.responder(solicitud);
      if (!respuesta) return siguiente(solicitud);
      return respuesta instanceof Promise ? from(respuesta) : of(respuesta);
    } catch (error) {
      return throwError(() => error);
    }
  }).pipe(
    // materialize so errors wait out the latency too, like a real round trip.
    materialize(),
    delay(LATENCIA_SIMULADA_MS),
    dematerialize(),
  );
};

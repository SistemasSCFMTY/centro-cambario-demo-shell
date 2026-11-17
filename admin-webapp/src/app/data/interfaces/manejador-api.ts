import { HttpRequest } from '@angular/common/http';
import { RespuestaSimulada } from '@data/types/simulacion.types';

/** The simulated backend of one module (Phase 1). Returns null for a route it doesn't own. */
export interface ManejadorApi {
  responder(solicitud: HttpRequest<unknown>): RespuestaSimulada | null;
}

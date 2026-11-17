import { HttpResponse } from '@angular/common/http';

/** What a simulated handler answers: right away, or once its data has loaded (a lazy catalog). */
export type RespuestaSimulada = HttpResponse<unknown> | Promise<HttpResponse<unknown>>;

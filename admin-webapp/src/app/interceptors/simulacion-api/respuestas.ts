import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';

/** A 200 answer. */
export function responderOk<T>(solicitud: HttpRequest<unknown>, cuerpo: T): HttpResponse<T> {
  return new HttpResponse({ status: 200, url: solicitud.url, body: cuerpo });
}

/** A refusal; it throws so the interceptor turns it into an HTTP error. */
export function rechazar(solicitud: HttpRequest<unknown>, status: number, codigo: string): never {
  throw new HttpErrorResponse({ status, url: solicitud.url, error: { codigo } });
}

/** The request's query params as a plain record (`HttpParams` in, what `consultaDeParametros` reads). */
export function parametrosPlanos(solicitud: HttpRequest<unknown>): Record<string, string> {
  const plano: Record<string, string> = {};
  for (const clave of solicitud.params.keys()) {
    const valor = solicitud.params.get(clave);
    if (valor !== null) plano[clave] = valor;
  }
  return plano;
}

/** The `:id` after `base` (`/api/operaciones/` + `op-0001`), or null when the URL isn't under it. */
export function idDeRuta(solicitud: HttpRequest<unknown>, base: string): string | null {
  if (!solicitud.url.startsWith(base)) return null;
  const id = solicitud.url.slice(base.length);
  return id && !id.includes('/') ? decodeURIComponent(id) : null;
}

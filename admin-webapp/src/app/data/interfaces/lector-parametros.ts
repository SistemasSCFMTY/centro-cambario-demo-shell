/** The part of `ParamMap` / `HttpParams` the list utils read. */
export interface LectorParametros {
  get(nombre: string): string | null;
}

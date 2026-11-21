import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ESTADO_LISTA_INICIAL, PARAMETROS_LISTA } from '@data/constants/lista.constants';
import { EsquemaLista } from '@data/interfaces/esquema-lista';
import { BackState } from '@data/interfaces/back-state';
import { EstadoLista } from '@data/interfaces/estado-lista';
import { OrdenLista } from '@data/interfaces/orden-lista';
import {
  contarFiltrosActivos,
  leerEstadoLista,
  paginaMaxima,
  parametrosDeEstado,
} from '@utils/lista/estado-lista';
import { backState } from '@utils/navigation/back-link';

/**
 * The URL state of one list page (plans/01 List behaviors). Provide it in the page component
 * (`providers: [ListaUrl]`), call `iniciar(ESQUEMA)` once, and load data **only** from `estado()`:
 * every change goes through the URL, so back/forward walk the filter history and filtered views
 * are shareable. Reads are sanitized by the schema; an empty value drops its param.
 */
@Injectable()
export class ListaUrl {
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);

  private readonly parametros = toSignal(this.ruta.queryParamMap, {
    initialValue: this.ruta.snapshot.queryParamMap,
  });
  private readonly esquemaActual = signal<EsquemaLista | null>(null);

  readonly esquema = this.esquemaActual.asReadonly();

  readonly estado = computed<EstadoLista>(() => {
    const esquema = this.esquemaActual();
    return esquema ? leerEstadoLista(this.parametros(), esquema) : ESTADO_LISTA_INICIAL;
  });

  /** Filters set in the popover; the badge reads it. */
  readonly filtrosActivos = computed(() => {
    const esquema = this.esquemaActual();
    return esquema ? contarFiltrosActivos(this.estado(), esquema) : 0;
  });

  /**
   * History state for the navigation to a row (`router.navigate([...], { state })`): the detail's
   * back link then returns to this exact view (see `EncabezadoPagina`).
   */
  backState(): BackState {
    return backState(this.router.url, this.ruta.snapshot.queryParams);
  }

  iniciar(esquema: EsquemaLista): void {
    this.esquemaActual.set(esquema);
  }

  /** Replaces the popover's filters (an empty value drops one); view switches stay. Back to page 1. */
  aplicarFiltros(valores: Record<string, string>): Promise<boolean> {
    const esquema = this.esquemaActual();
    if (!esquema) return Promise.resolve(false);
    const filtros = { ...this.estado().filtros };
    for (const definicion of esquema.filtros.filter((f) => !f.soloUrl)) {
      delete filtros[definicion.id];
    }
    const sanitizado = leerEstadoLista({ get: (id) => valores[id] ?? null }, esquema).filtros;
    for (const definicion of esquema.filtros.filter((f) => !f.soloUrl)) {
      if (definicion.id in sanitizado) filtros[definicion.id] = sanitizado[definicion.id];
    }
    return this.navegar({ ...this.estado(), pagina: 1, filtros });
  }

  /** One filter, usually a view switch such as `vista`. Back to page 1. */
  establecerFiltro(id: string, valor: string | null): Promise<boolean> {
    const filtros = { ...this.estado().filtros };
    if (valor) filtros[id] = valor;
    else delete filtros[id];
    return this.navegar({ ...this.estado(), pagina: 1, filtros });
  }

  limpiarFiltros(): Promise<boolean> {
    const esquema = this.esquemaActual();
    if (!esquema) return Promise.resolve(false);
    const filtros: Record<string, string> = {};
    for (const definicion of esquema.filtros.filter((f) => f.soloUrl)) {
      const actual = this.estado().filtros[definicion.id];
      if (actual) filtros[definicion.id] = actual;
    }
    return this.navegar({ ...this.estado(), pagina: 1, filtros });
  }

  irAPagina(pagina: number): Promise<boolean> {
    return this.navegar({ ...this.estado(), pagina: Math.max(1, Math.floor(pagina)) });
  }

  cambiarTamano(tamano: number): Promise<boolean> {
    return this.navegar({ ...this.estado(), pagina: 1, tamano });
  }

  /** `null` goes back to the schema's default order. */
  ordenar(orden: OrdenLista | null): Promise<boolean> {
    return this.navegar({ ...this.estado(), pagina: 1, orden });
  }

  /**
   * After a load: when the page is past the last one with rows (a deletion or a narrower filter
   * emptied it), steps back to the last page, replacing the history entry.
   */
  ajustarPagina(total: number): Promise<boolean> {
    const estado = this.estado();
    const ultima = paginaMaxima(total, estado.tamano);
    return estado.pagina > ultima
      ? this.navegar({ ...estado, pagina: ultima }, true)
      : Promise.resolve(true);
  }

  private navegar(estado: EstadoLista, reemplazar = false): Promise<boolean> {
    const esquema = this.esquemaActual();
    if (!esquema) return Promise.resolve(false);
    const gestionados = [...Object.values(PARAMETROS_LISTA), ...esquema.filtros.map((f) => f.id)];
    const queryParams: Params = Object.fromEntries(gestionados.map((clave) => [clave, null]));
    Object.assign(queryParams, parametrosDeEstado(estado, esquema));
    return this.router.navigate([], {
      relativeTo: this.ruta,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: reemplazar,
    });
  }
}

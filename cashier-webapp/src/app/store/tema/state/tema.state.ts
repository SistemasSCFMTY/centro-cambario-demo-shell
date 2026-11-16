import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { CLASE_MODO_OSCURO, TEMA_INICIAL } from '@data/constants/tema.constants';
import { MarcaDto } from '@data/dto/marca.dto';
import { EscalaColor, ModoTema, NombreColorMarca } from '@data/types/tema.types';
import { Action, NgxsAfterBootstrap, Selector, State, StateContext } from '@ngxs/store';
import { MarcaService } from '@services/marca/marca.service';
import {
  CargarMarca,
  EstablecerModoTema,
  EstablecerPreferenciaOscuro,
} from '@store/tema/actions/tema.actions';
import { TemaStateModel } from '@store/tema/types/tema.types';
import { derivarEscala, textoSobre } from '@utils/tema/escala-color';
import { tap } from 'rxjs';

/**
 * Mode and tenant branding, and their effect on the page (plans/00 Theme pipeline):
 * 1. the branding's primary/accent bases expand into 50…1000 scales (`--color-primary-*`, `--color-accent-*`);
 * 2. styles.css maps those scales onto Spartan's variables (`--primary`, `--ring`, `--chart-*`…);
 * 3. the mode toggles `.dark` on <html>. The chrome is a `.dark` scope of its own, so it stays dark.
 */
@State<TemaStateModel>({ name: 'tema', defaults: TEMA_INICIAL })
@Injectable()
export class TemaState implements NgxsAfterBootstrap {
  private readonly document = inject(DOCUMENT);
  private readonly marcaService = inject(MarcaService);

  @Selector()
  static modo(state: TemaStateModel): ModoTema {
    return state.modo;
  }

  @Selector()
  static marca(state: TemaStateModel): MarcaDto | null {
    return state.marca;
  }

  @Selector()
  static nombreNegocio(state: TemaStateModel): string {
    return state.marca?.nombre ?? '';
  }

  /** The mode actually shown, with 'sistema' resolved. */
  @Selector()
  static esOscuro(state: TemaStateModel): boolean {
    return state.modo === 'oscuro' || (state.modo === 'sistema' && state.prefiereOscuro);
  }

  /** After the storage plugin restored `modo`. */
  ngxsAfterBootstrap(ctx: StateContext<TemaStateModel>): void {
    const consulta = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    ctx.patchState({ prefiereOscuro: consulta?.matches ?? false });
    this.aplicarModo(ctx);
    consulta?.addEventListener('change', (evento) =>
      ctx.dispatch(new EstablecerPreferenciaOscuro(evento.matches)),
    );
  }

  @Action(CargarMarca)
  cargarMarca(ctx: StateContext<TemaStateModel>) {
    return this.marcaService.obtener().pipe(
      tap((marca) => {
        ctx.patchState({ marca });
        this.aplicarColor('primary', derivarEscala(marca.colorPrimario));
        this.aplicarColor('accent', derivarEscala(marca.colorAcento));
        this.aplicarFavicon(marca.faviconUrl);
      }),
    );
  }

  @Action(EstablecerModoTema)
  establecerModo(ctx: StateContext<TemaStateModel>, { modo }: EstablecerModoTema): void {
    ctx.patchState({ modo });
    this.aplicarModo(ctx);
  }

  @Action(EstablecerPreferenciaOscuro)
  establecerPreferencia(
    ctx: StateContext<TemaStateModel>,
    { prefiereOscuro }: EstablecerPreferenciaOscuro,
  ): void {
    ctx.patchState({ prefiereOscuro });
    this.aplicarModo(ctx);
  }

  private aplicarModo(ctx: StateContext<TemaStateModel>): void {
    this.document.documentElement.classList.toggle(
      CLASE_MODO_OSCURO,
      TemaState.esOscuro(ctx.getState()),
    );
  }

  /** The scale on <html>, plus readable text for the shades buttons and badges sit on (600 light, 500 dark). */
  private aplicarColor(nombre: NombreColorMarca, escala: EscalaColor): void {
    const estilo = this.document.documentElement.style;
    for (const [tono, valor] of Object.entries(escala)) {
      estilo.setProperty(`--color-${nombre}-${tono}`, valor);
    }
    estilo.setProperty(`--${nombre}-texto-claro`, textoSobre(escala['600'], escala['1000']));
    estilo.setProperty(`--${nombre}-texto-oscuro`, textoSobre(escala['500'], escala['1000']));
  }

  private aplicarFavicon(url: string | null): void {
    if (!url) return;
    const enlace = this.document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (enlace) enlace.href = url;
  }
}

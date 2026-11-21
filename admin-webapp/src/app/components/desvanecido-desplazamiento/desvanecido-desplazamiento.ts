import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Renderer2,
} from '@angular/core';

/**
 * onp's `appScrollFade`: on a horizontal scroll container, a soft fade at the right edge while more
 * of the content lies to the right. It is gone once the user reaches the end, and when everything
 * fits. The fade is one `pointer-events-none` element placed after the host, going from transparent
 * to the panel surface, so it never blocks clicks, text selection or the scrollbar.
 *
 * The host's parent must be positioned (`relative`): the directive never restyles an element it
 * doesn't own. The fade covers the host's visible height, minus the `thead` when the host holds a
 * table (the header row keeps its own fill), and stops above the horizontal scrollbar. Both are
 * measured on every update, since the header follows the fonts and the scrollbar is zero-height on
 * overlay-scrollbar systems.
 *
 * It also marks the host for pinned columns (`pinned-start` / `pinned-end`):
 * `data-scrolled` while scrolled away from the start and `data-overflowing` while more lies to the right,
 * which draw their edge hairlines. With a pinned end column, the fade stops at that column's edge.
 */
@Directive({ selector: '[appDesvanecidoDesplazamiento]' })
export class DesvanecidoDesplazamiento {
  private readonly anfitrion = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  private velo: HTMLElement | null = null;
  private observador: ResizeObserver | null = null;

  private readonly actualizar = (): void => {
    const host = this.anfitrion.nativeElement;
    const velo = this.velo;
    const padre = host.parentElement;
    if (!velo || !padre) return;
    const hayMas = host.scrollLeft + host.clientWidth < host.scrollWidth - 1;
    this.setFlag(host, 'data-scrolled', host.scrollLeft > 0);
    this.setFlag(host, 'data-overflowing', hayMas);
    if (!hayMas) {
      this.renderer.addClass(velo, 'hidden');
      return;
    }
    const encabezado = host.querySelector<HTMLElement>('thead')?.offsetHeight ?? 0;
    const finVisible = host.offsetTop + host.clientHeight;
    const pinnedEndWidth = host.querySelector<HTMLElement>('thead .pinned-end')?.offsetWidth ?? 0;
    this.renderer.setStyle(velo, 'top', `${host.offsetTop + encabezado}px`);
    this.renderer.setStyle(velo, 'bottom', `${Math.max(0, padre.clientHeight - finVisible)}px`);
    this.renderer.setStyle(
      velo,
      'right',
      `${Math.max(0, padre.clientWidth - host.offsetLeft - host.offsetWidth) + pinnedEndWidth}px`,
    );
    this.renderer.removeClass(velo, 'hidden');
  };

  constructor() {
    afterNextRender(() => this.montar());
    this.destroyRef.onDestroy(() => this.desmontar());
  }

  private montar(): void {
    const host = this.anfitrion.nativeElement;
    const padre = host.parentElement;
    if (!padre) return;
    const velo = this.renderer.createElement('div') as HTMLElement;
    velo.className =
      'hidden pointer-events-none absolute w-12 bg-linear-to-r from-transparent to-panel';
    velo.setAttribute('aria-hidden', 'true');
    this.renderer.insertBefore(padre, velo, host.nextSibling);
    this.velo = velo;
    host.addEventListener('scroll', this.actualizar, { passive: true });
    this.observador = new ResizeObserver(this.actualizar);
    this.observador.observe(host);
    // The table grows and shrinks with its rows and columns while the host keeps its size.
    for (const hijo of Array.from(host.children)) this.observador.observe(hijo);
    this.actualizar();
  }

  private setFlag(host: HTMLElement, attribute: string, on: boolean): void {
    if (on) this.renderer.setAttribute(host, attribute, '');
    else this.renderer.removeAttribute(host, attribute);
  }

  private desmontar(): void {
    this.anfitrion.nativeElement.removeEventListener('scroll', this.actualizar);
    this.observador?.disconnect();
    this.velo?.remove();
  }
}

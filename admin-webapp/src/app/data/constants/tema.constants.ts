import { AjusteTono } from '@data/interfaces/ajuste-tono';
import { OpcionModo } from '@data/interfaces/opcion-modo';
import { ModoTema, Tono } from '@data/types/tema.types';
import { TemaStateModel } from '@store/tema/types/tema.types';

export const TONOS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
  '1000',
] as const;

export const MODO_TEMA_PREDETERMINADO: ModoTema = 'sistema';

export const TEMA_INICIAL: TemaStateModel = {
  modo: MODO_TEMA_PREDETERMINADO,
  prefiereOscuro: false,
  marca: null,
};

/** The class that turns on the dark tokens (`.dark` in styles.css and Tailwind's `dark:`). */
export const CLASE_MODO_OSCURO = 'dark';

/** NGXS storage key (localStorage). index.html reads the same key before first paint. */
export const CLAVE_ALMACEN_MODO = 'tema.modo';

export const OPCIONES_MODO: readonly OpcionModo[] = [
  { valor: 'sistema', etiqueta: 'Sistema', icono: 'lucideMonitor' },
  { valor: 'claro', etiqueta: 'Claro', icono: 'lucideSun' },
  { valor: 'oscuro', etiqueta: 'Oscuro', icono: 'lucideMoon' },
];

/** A brand base as the API takes it: `#rrggbb`. */
export const PATRON_COLOR_HEX = /^#[0-9a-fA-F]{6}$/;

/**
 * How far each shade moves from the 500 base. Lighter shades move lightness toward
 * `LUMINOSIDAD_CLARA` and drop chroma; darker ones move toward `LUMINOSIDAD_OSCURA` and keep more of
 * it. The base's hue is kept, so the scale reads as one color at every step.
 */
export const AJUSTE_POR_TONO: Readonly<Record<Tono, AjusteTono>> = {
  '50': { hacia: 'claro', t: 0.93, croma: 0.12 },
  '100': { hacia: 'claro', t: 0.84, croma: 0.22 },
  '200': { hacia: 'claro', t: 0.67, croma: 0.4 },
  '300': { hacia: 'claro', t: 0.47, croma: 0.62 },
  '400': { hacia: 'claro', t: 0.24, croma: 0.84 },
  '500': { hacia: null, t: 0, croma: 1 },
  '600': { hacia: 'oscuro', t: 0.16, croma: 0.96 },
  '700': { hacia: 'oscuro', t: 0.33, croma: 0.86 },
  '800': { hacia: 'oscuro', t: 0.5, croma: 0.74 },
  '900': { hacia: 'oscuro', t: 0.66, croma: 0.6 },
  '950': { hacia: 'oscuro', t: 0.78, croma: 0.48 },
  '1000': { hacia: 'oscuro', t: 0.88, croma: 0.38 },
};

/** OKLCH lightness the light and dark ends of a brand scale aim for. */
export const LUMINOSIDAD_CLARA = 0.985;
export const LUMINOSIDAD_OSCURA = 0.15;

/** WCAG AA for body text: the least contrast white text needs on a brand fill. */
export const CONTRASTE_MINIMO_TEXTO = 4.5;

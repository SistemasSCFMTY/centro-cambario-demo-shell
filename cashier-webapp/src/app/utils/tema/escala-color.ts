import {
  AJUSTE_POR_TONO,
  CONTRASTE_MINIMO_TEXTO,
  LUMINOSIDAD_CLARA,
  LUMINOSIDAD_OSCURA,
  PATRON_COLOR_HEX,
  TONOS,
} from '@data/constants/tema.constants';
import { EscalaColor } from '@data/types/tema.types';

/** The twelve shades 50…1000 from one 500 base (`#rrggbb`), lowercase hex, all inside sRGB. */
export function derivarEscala(base: string): EscalaColor {
  if (!PATRON_COLOR_HEX.test(base)) throw new Error('El color base debe ser #rrggbb.');
  const [l0, c0, h] = hexAOklch(base);
  const escala = {} as EscalaColor;
  for (const tono of TONOS) {
    const { hacia, t, croma } = AJUSTE_POR_TONO[tono];
    if (hacia === null) {
      escala[tono] = base.toLowerCase();
      continue;
    }
    const destino =
      hacia === 'claro' ? Math.max(LUMINOSIDAD_CLARA, l0) : Math.min(LUMINOSIDAD_OSCURA, l0);
    escala[tono] = oklchAHex(l0 + (destino - l0) * t, c0 * croma, h);
  }
  return escala;
}

/** WCAG 2 contrast ratio between two `#rrggbb` colors. */
export function contraste(a: string, b: string): number {
  const [la, lb] = [luminancia(a), luminancia(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** White text when it clears AA (4.5:1) on `fondo`, otherwise the darkest shade of the same scale. */
export function textoSobre(fondo: string, oscuro: string): string {
  return contraste(fondo, '#ffffff') >= CONTRASTE_MINIMO_TEXTO ? '#ffffff' : oscuro;
}

function luminancia(hex: string): number {
  const [r, g, b] = canalesLineales(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function canalesLineales(hex: string): [number, number, number] {
  const canal = (i: number) => aLineal(parseInt(hex.slice(i, i + 2), 16) / 255);
  return [canal(1), canal(3), canal(5)];
}

function hexAOklch(hex: string): [number, number, number] {
  const [r, g, b] = canalesLineales(hex);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), Math.atan2(B, A)];
}

/** OKLCH to hex, lowering chroma until the color fits in sRGB. */
function oklchAHex(L: number, C: number, h: number): string {
  let croma = C;
  for (;;) {
    const lineales = oklchALineal(L, croma, h);
    if (lineales.every((c) => c >= -1e-6 && c <= 1 + 1e-6) || croma < 1e-4) {
      return `#${lineales.map((c) => aByte(c).toString(16).padStart(2, '0')).join('')}`;
    }
    croma *= 0.97;
  }
}

function oklchALineal(L: number, C: number, h: number): [number, number, number] {
  const A = C * Math.cos(h);
  const B = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function aLineal(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function aByte(lineal: number): number {
  const c = Math.min(Math.max(lineal, 0), 1);
  const codificado = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  return Math.round(codificado * 255);
}

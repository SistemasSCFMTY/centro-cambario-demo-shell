import { Divisa } from '@data/interfaces/divisa';

/** MXN base plus the five seed currencies, keyed by ISO 4217 (plans/catalogos/divisas.json). */
export const DIVISAS: readonly Divisa[] = [
  { clave: 'MXN', nombre: 'Peso mexicano', simbolo: '$', decimales: 2, base: true },
  { clave: 'USD', nombre: 'Dólar estadounidense', simbolo: 'US$', decimales: 2, base: false },
  { clave: 'EUR', nombre: 'Euro', simbolo: '€', decimales: 2, base: false },
  { clave: 'JPY', nombre: 'Yen japonés', simbolo: '¥', decimales: 0, base: false },
  { clave: 'CNY', nombre: 'Yuan renminbi', simbolo: 'CN¥', decimales: 2, base: false },
  { clave: 'KRW', nombre: 'Won surcoreano', simbolo: '₩', decimales: 0, base: false },
];

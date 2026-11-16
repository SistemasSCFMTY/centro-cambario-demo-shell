import { TONOS } from '@data/constants/tema.constants';

/** 'sistema' (the default) follows the OS until the user picks claro or oscuro. */
export type ModoTema = 'sistema' | 'claro' | 'oscuro';

export type Tono = (typeof TONOS)[number];

/** A brand scale 50…1000 as `#rrggbb`. */
export type EscalaColor = Record<Tono, string>;

export type NombreColorMarca = 'primary' | 'accent';

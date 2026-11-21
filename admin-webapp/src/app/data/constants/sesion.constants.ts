import { SesionStateModel } from '@store/sesion/types/sesion.types';

export const SESION_INICIAL: SesionStateModel = { sesion: null };

/** NGXS storage key (localStorage): the session survives a reload (lead, 2026-11-20). */
export const SESSION_STORAGE_KEY = 'sesion';

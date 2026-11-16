/** backend-api base path. Phase 1: the simulated API interceptor answers everything under it. */
export const URL_API = '/api';

export const RUTAS_API = {
  marca: `${URL_API}/marca`,
  inicioSesion: `${URL_API}/autenticacion/inicio-sesion`,
  verificacion: `${URL_API}/autenticacion/verificacion`,
  reenvio: `${URL_API}/autenticacion/reenvio`,
} as const;

/** Phase 1: simulated network time, so the pages show their pending states. */
export const LATENCIA_SIMULADA_MS = 450;

/** PF = persona física, PM = persona moral. */
export type TipoPersona = 'PF' | 'PM';

export type EstatusCliente = 'ACTIVO' | 'SUSPENDIDO' | 'BLOQUEADO';

export type GradoRiesgo = 'BAJO' | 'MEDIO' | 'ALTO';

/** Kind of persona políticamente expuesta; only a foreign one needs authorization (16ª). */
export type TipoPep = 'NACIONAL' | 'EXTRANJERA';

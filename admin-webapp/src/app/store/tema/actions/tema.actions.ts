import { ModoTema } from '@data/types/tema.types';

/** Loads the tenant branding and applies its colors, name and favicon. Runs once at startup. */
export class CargarMarca {
  static readonly type = '[Tema] Cargar marca';
}

/** The user picked a mode; the storage plugin keeps it in localStorage. */
export class EstablecerModoTema {
  static readonly type = '[Tema] Establecer modo';
  constructor(readonly modo: ModoTema) {}
}

/** The OS switched between light and dark. */
export class EstablecerPreferenciaOscuro {
  static readonly type = '[Tema] Establecer preferencia oscuro';
  constructor(readonly prefiereOscuro: boolean) {}
}

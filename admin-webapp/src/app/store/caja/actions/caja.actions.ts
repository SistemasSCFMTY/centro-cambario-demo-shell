import { ConsultaListaDto } from '@data/dto/lista.dto';

/** Loads one page of cajas and bóvedas. The page reads `ListaUrl.estado()` and dispatches this when it changes. */
export class CargarCajas {
  static readonly type = '[Caja] Cargar cajas';
  constructor(readonly consulta: ConsultaListaDto) {}
}

/** Loads one page of conteos (apertura, arqueo, corte). */
export class CargarConteos {
  static readonly type = '[Caja] Cargar conteos';
  constructor(readonly consulta: ConsultaListaDto) {}
}

/** Loads the sucursales the filters offer. */
export class CargarSucursalesCaja {
  static readonly type = '[Caja] Cargar sucursales';
}

/** Loads the cajas the conteos filter offers. */
export class CargarOpcionesCajas {
  static readonly type = '[Caja] Cargar opciones de cajas';
}

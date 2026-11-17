import { ConsultaListaDto } from '@data/dto/lista.dto';

/** Loads one page of the list. The page reads `ListaUrl.estado()` and dispatches this when it changes. */
export class CargarOperaciones {
  static readonly type = '[Operaciones] Cargar lista';
  constructor(readonly consulta: ConsultaListaDto) {}
}

export class CargarOperacion {
  static readonly type = '[Operaciones] Cargar detalle';
  constructor(readonly id: string) {}
}

/** Loads sucursales, cajeros and divisas for the list filters. */
export class CargarCatalogosOperaciones {
  static readonly type = '[Operaciones] Cargar catálogos';
}

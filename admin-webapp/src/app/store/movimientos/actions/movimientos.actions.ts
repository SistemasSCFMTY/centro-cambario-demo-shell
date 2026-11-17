import { ConsultaListaDto } from '@data/dto/lista.dto';
import { MontoMovimiento } from '@data/interfaces/monto-movimiento';

/** Loads one page of the list. The page reads `ListaUrl.estado()` and dispatches this when it changes. */
export class CargarMovimientos {
  static readonly type = '[Movimientos] Cargar lista';
  constructor(readonly consulta: ConsultaListaDto) {}
}

/** Downloads the filtered list (all pages) as a file. */
export class ExportarMovimientos {
  static readonly type = '[Movimientos] Exportar';
  constructor(readonly consulta: ConsultaListaDto) {}
}

export class CargarMovimiento {
  static readonly type = '[Movimientos] Cargar detalle';
  constructor(readonly id: string) {}
}

export class CargarSucursalesMovimientos {
  static readonly type = '[Movimientos] Cargar sucursales';
}

/** Approves a pending dotación; `montos` carries the correction when the reviewer changed them. */
export class AprobarDotacion {
  static readonly type = '[Movimientos] Aprobar dotación';
  constructor(
    readonly id: string,
    readonly usuarioId: string,
    readonly montos: MontoMovimiento[],
    readonly comentario: string | null,
  ) {}
}

/** Declines a pending dotación completely. Final. */
export class RechazarDotacion {
  static readonly type = '[Movimientos] Rechazar dotación';
  constructor(
    readonly id: string,
    readonly usuarioId: string,
    readonly motivo: string,
  ) {}
}

export class LimpiarErrorRevision {
  static readonly type = '[Movimientos] Limpiar error de revisión';
}

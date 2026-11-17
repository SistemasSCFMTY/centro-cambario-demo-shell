import { Movimiento } from '@data/interfaces/movimiento';
import { MontoMovimiento } from '@data/interfaces/monto-movimiento';
import { PasoSeguimientoMovimiento } from '@data/interfaces/paso-seguimiento-movimiento';
import { RegistroAuditoria } from '@data/interfaces/registro-auditoria';
import { PaginaDto } from '@data/dto/lista.dto';

/** A movement with the names a row shows. */
export interface MovimientoListaDto extends Movimiento {
  origen: string;
  /** The sucursal of a caja; «Sucursal» or «Banco» for the other ends. */
  origenDetalle: string;
  destino: string;
  destinoDetalle: string;
  solicitadoPor: string;
  resueltoPor: string | null;
}

/** One page of the list, and the totals behind its filters. */
export interface MovimientosPaginaDto extends PaginaDto<MovimientoListaDto> {
  /** What moved in each currency across the filtered movements; cancelled and declined ones don't count. */
  totales: MontoMovimiento[];
}

export interface MovimientoDetalleDto {
  movimiento: MovimientoListaDto;
  seguimiento: PasoSeguimientoMovimiento[];
  auditoria: RegistroAuditoria[];
  /** Decimal places of each currency (ISO 4217), for the amount inputs. */
  decimales: Record<string, number>;
}

/** Approve a pending dotación, correcting the amounts when they differ from the request. */
export interface AprobacionDotacionDto {
  /** The superadmin who reviews. Phase 2 takes it from the session token. */
  usuarioId: string;
  montos: MontoMovimiento[];
  comentario: string | null;
}

/** Decline a pending dotación completely. Final. */
export interface RechazoDotacionDto {
  usuarioId: string;
  motivo: string;
}

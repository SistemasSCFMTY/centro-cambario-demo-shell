import { MovimientoDetalleDto, MovimientosPaginaDto } from '@data/dto/movimientos.dto';
import { Sucursal } from '@data/interfaces/sucursal';

export interface MovimientosStateModel {
  /** The page the list shows; null before the first load. */
  pagina: MovimientosPaginaDto | null;
  detalle: MovimientoDetalleDto | null;
  /** For the sucursal filter. */
  sucursales: Sucursal[];
  cargandoLista: boolean;
  cargandoDetalle: boolean;
  exportando: boolean;
  /** A review (approve or decline) is on its way. */
  guardando: boolean;
  /** Message of the last failed load of the list or of the export. */
  errorLista: string | null;
  /** Message of the last failed load of one movement. */
  errorDetalle: string | null;
  /** The last movement asked for doesn't exist (404). */
  notFound: boolean;
  /** Message of the last refused review. */
  errorRevision: string | null;
}

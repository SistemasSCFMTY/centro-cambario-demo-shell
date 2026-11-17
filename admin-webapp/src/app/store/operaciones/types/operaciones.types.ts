import { PaginaDto } from '@data/dto/lista.dto';
import { OperacionDetalleDto, OperacionListaDto } from '@data/dto/operaciones.dto';
import { Cajero } from '@data/interfaces/cajero';
import { Divisa } from '@data/interfaces/divisa';
import { Sucursal } from '@data/interfaces/sucursal';

export interface OperacionesStateModel {
  /** The page the list shows; null before the first load. */
  pagina: PaginaDto<OperacionListaDto> | null;
  detalle: OperacionDetalleDto | null;
  /** What the list filters offer; empty until the catalogs arrive. */
  sucursales: Sucursal[];
  cajeros: Cajero[];
  divisas: Divisa[];
  /** The detail request answered 404 (as opposed to failing). */
  noEncontrada: boolean;
  cargando: boolean;
  /** Message of the last failed load, as the page shows it. */
  error: string | null;
}

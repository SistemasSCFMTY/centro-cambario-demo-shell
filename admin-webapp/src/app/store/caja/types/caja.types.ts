import { CajasPaginaDto, ConteosPaginaDto } from '@data/dto/caja-pagina.dto';
import { OpcionFiltro } from '@data/interfaces/opcion-filtro';
import { Sucursal } from '@data/interfaces/sucursal';

export interface CajaStateModel {
  /** The page the cajas list shows; null before the first load. */
  cajas: CajasPaginaDto | null;
  /** The page the conteos list shows; null before the first load. */
  conteos: ConteosPaginaDto | null;
  /** Catalog for the sucursal filter. */
  sucursales: Sucursal[];
  /** Catalog for the caja filter of the conteos: each drawer with its sucursal. */
  opcionesCajas: OpcionFiltro[];
  cargandoCajas: boolean;
  cargandoConteos: boolean;
  /** Message of the last failed load of each list, as the page shows it. */
  errorCajas: string | null;
  errorConteos: string | null;
}

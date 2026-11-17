import { PaginaDto } from '@data/dto/lista.dto';
import { Caja } from '@data/interfaces/caja';
import { TipoConteo } from '@data/types/conteo-caja.types';
import { TipoCaja } from '@data/types/caja.types';
import { EstatusCaja } from '@data/types/caja.types';
import { CodigoDivisa } from '@data/types/divisa.types';

/** One row of the cajas list: a drawer or vault with its sucursal, responsable and balance per currency. */
export interface CajaFilaDto extends Caja {
  sucursal: string;
  responsable: string | null;
  estatus: EstatusCaja;
  saldos: Record<CodigoDivisa, number>;
}

/** What the cajas of the current filter hold of one currency, all pages. */
export interface TotalDivisaDto {
  divisa: CodigoDivisa;
  saldo: number;
  decimales: number;
}

export interface CajasPaginaDto extends PaginaDto<CajaFilaDto> {
  totales: TotalDivisaDto[];
}

/** One currency of a conteo, as the list draws it. `diferencia` is already 0 when the count cuadra. */
export interface ConteoMonedaDto {
  divisa: CodigoDivisa;
  decimales: number;
  sistema: number;
  contado: number;
  diferencia: number;
}

/** One row of the conteos list. `detalle` keeps only the currencies with something counted or a difference. */
export interface ConteoFilaDto {
  id: string;
  cajaId: string;
  tipoCaja: TipoCaja;
  tipo: TipoConteo;
  realizadoEn: string;
  caja: string;
  sucursal: string;
  responsable: string;
  realizo: string;
  observaciones: string | null;
  detalle: ConteoMonedaDto[];
}

/** Sobrante and faltante of one currency in the current filter. Arqueos don't count: the corte settles them. */
export interface DiferenciaDivisaDto {
  divisa: CodigoDivisa;
  decimales: number;
  sobrante: number;
  faltante: number;
}

export interface ConteosPaginaDto extends PaginaDto<ConteoFilaDto> {
  diferencias: DiferenciaDivisaDto[];
}

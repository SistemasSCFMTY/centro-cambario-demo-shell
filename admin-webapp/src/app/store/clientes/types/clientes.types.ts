import { ClienteDetalleDto } from '@data/dto/clientes.dto';
import { ClienteOperacionesDto } from '@data/dto/clientes-operaciones.dto';
import { PaginaDto } from '@data/dto/lista.dto';
import { ClienteResumen } from '@data/interfaces/cliente-resumen';

export interface ClientesStateModel {
  pagina: PaginaDto<ClienteResumen> | null;
  detalle: ClienteDetalleDto | null;
  operaciones: ClienteOperacionesDto | null;
  cargando: boolean;
  cargandoOperaciones: boolean;
  error: string | null;
  /** The detail request answered 404. */
  detalleNoEncontrado: boolean;
  errorOperaciones: string | null;
}

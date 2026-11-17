import { ClienteOperacion } from '@data/interfaces/cliente-operacion';
import { MovimientoCliente } from '@data/interfaces/movimiento-cliente';
import { ResumenOperadoCliente } from '@data/interfaces/resumen-operado-cliente';

/** What `GET /clientes/:id/operaciones` answers: the figures, the latest operaciones (newest first) and the cash ledger. */
export interface ClienteOperacionesDto {
  resumen: ResumenOperadoCliente;
  operaciones: ClienteOperacion[];
  movimientos: MovimientoCliente[];
}

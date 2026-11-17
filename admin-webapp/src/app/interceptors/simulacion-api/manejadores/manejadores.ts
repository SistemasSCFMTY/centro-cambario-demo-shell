import { ManejadorApi } from '@data/interfaces/manejador-api';
import { manejadorCaja } from '@interceptors/simulacion-api/manejadores/caja.manejador';
import { manejadorCatalogos } from '@interceptors/simulacion-api/manejadores/catalogos.manejador';
import { manejadorClientes } from '@interceptors/simulacion-api/manejadores/clientes.manejador';
import { manejadorMovimientos } from '@interceptors/simulacion-api/manejadores/movimientos.manejador';
import { manejadorNegocio } from '@interceptors/simulacion-api/manejadores/negocio.manejador';
import { manejadorOperaciones } from '@interceptors/simulacion-api/manejadores/operaciones.manejador';

/** Every module's simulated backend, in one list. `ApiSimulada` asks them in order. A new module adds its line here. */
export const MANEJADORES: readonly ManejadorApi[] = [
  manejadorCatalogos,
  manejadorOperaciones,
  manejadorCaja,
  manejadorMovimientos,
  manejadorClientes,
  manejadorNegocio,
];

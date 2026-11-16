import { ElementoNavegacion } from '@data/interfaces/elemento-navegacion';
import {
  lucideArrowLeftRight,
  lucideBanknote,
  lucideLayoutDashboard,
  lucideUsers,
} from '@ng-icons/lucide';

/** Every cashier module (plans/00 cashier-webapp). The top bar and the routes are both built from this list. */
export const NAVEGACION: readonly ElementoNavegacion[] = [
  {
    etiqueta: 'Inicio',
    ruta: 'inicio',
    icono: 'lucideLayoutDashboard',
    descripcion:
      'Tipos de cambio del día, el saldo de su caja por divisa y las operaciones de hoy.',
  },
  {
    etiqueta: 'Operaciones',
    ruta: 'operaciones',
    icono: 'lucideArrowLeftRight',
    descripcion: 'Compras y ventas de divisas en ventanilla.',
  },
  {
    etiqueta: 'Caja',
    ruta: 'caja',
    icono: 'lucideBanknote',
    descripcion: 'Apertura, entradas y salidas, y corte de su caja.',
  },
  {
    etiqueta: 'Clientes',
    ruta: 'clientes',
    icono: 'lucideUsers',
    descripcion: 'Registro y consulta de clientes.',
  },
];

export const ICONOS_NAVEGACION = {
  lucideArrowLeftRight,
  lucideBanknote,
  lucideLayoutDashboard,
  lucideUsers,
};

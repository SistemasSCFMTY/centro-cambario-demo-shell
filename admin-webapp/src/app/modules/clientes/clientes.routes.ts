import { Routes } from '@angular/router';
import { provideStates } from '@ngxs/store';
import { ClientesState } from '@store/clientes/state/clientes.state';
import { elementoPorRuta } from '@utils/navegacion/elemento-navegacion';

/** Routes of `clientes` (read-only this ola), loaded lazily by app.routes. The module provides its own NGXS states here. */
export const rutasClientes: Routes = [
  {
    path: '',
    providers: [provideStates([ClientesState])],
    children: [
      {
        path: '',
        title: elementoPorRuta('clientes').etiqueta,
        loadComponent: () =>
          import('@modules/clientes/pages/clientes-lista/clientes-lista').then(
            (m) => m.ClientesLista,
          ),
      },
      {
        path: ':id',
        title: 'Detalle del cliente',
        loadComponent: () =>
          import('@modules/clientes/pages/cliente-detalle/cliente-detalle').then(
            (m) => m.ClienteDetallePagina,
          ),
      },
    ],
  },
];

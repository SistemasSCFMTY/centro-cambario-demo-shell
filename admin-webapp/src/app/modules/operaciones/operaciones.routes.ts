import { Routes } from '@angular/router';
import { provideStates } from '@ngxs/store';
import { OperacionesState } from '@store/operaciones/state/operaciones.state';
import { elementoPorRuta } from '@utils/navegacion/elemento-navegacion';

/** Routes of `operaciones` (read-only in the admin), loaded lazily by app.routes. */
export const rutasOperaciones: Routes = [
  {
    path: '',
    providers: [provideStates([OperacionesState])],
    children: [
      {
        path: '',
        title: elementoPorRuta('operaciones').etiqueta,
        data: { elemento: elementoPorRuta('operaciones') },
        loadComponent: () =>
          import('@modules/operaciones/pages/operaciones-lista/operaciones-lista').then(
            (m) => m.OperacionesLista,
          ),
      },
      {
        path: ':id',
        title: 'Operación',
        loadComponent: () =>
          import('@modules/operaciones/pages/operacion-detalle/operacion-detalle').then(
            (m) => m.OperacionDetalle,
          ),
      },
    ],
  },
];

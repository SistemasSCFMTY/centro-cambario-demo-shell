import { Routes } from '@angular/router';
import { provideStates } from '@ngxs/store';
import { MovimientosState } from '@store/movimientos/state/movimientos.state';
import { elementoPorRuta } from '@utils/navegacion/elemento-navegacion';

/** Routes of `movimientos`, loaded lazily by app.routes. The module provides its own NGXS states here. */
export const rutasMovimientos: Routes = [
  {
    path: '',
    providers: [provideStates([MovimientosState])],
    children: [
      {
        path: '',
        title: elementoPorRuta('movimientos').etiqueta,
        data: { elemento: elementoPorRuta('movimientos') },
        loadComponent: () =>
          import('@modules/movimientos/pages/lista/movimientos-lista').then(
            (m) => m.MovimientosLista,
          ),
      },
      {
        path: ':id',
        title: 'Detalle de movimiento',
        data: { elemento: elementoPorRuta('movimientos') },
        loadComponent: () =>
          import('@modules/movimientos/pages/detalle/movimiento-detalle').then(
            (m) => m.MovimientoDetalle,
          ),
      },
      {
        path: ':id/revisar',
        title: 'Revisar dotación',
        data: { elemento: elementoPorRuta('movimientos') },
        loadComponent: () =>
          import('@modules/movimientos/pages/revision/revision-dotacion').then(
            (m) => m.RevisionDotacion,
          ),
      },
    ],
  },
];

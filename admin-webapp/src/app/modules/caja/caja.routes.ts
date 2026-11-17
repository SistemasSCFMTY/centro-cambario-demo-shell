import { Routes } from '@angular/router';
import { provideStates } from '@ngxs/store';
import { CajaState } from '@store/caja/state/caja.state';
import { elementoPorRuta } from '@utils/navegacion/elemento-navegacion';

/** Routes of `caja`, loaded lazily by app.routes. The module provides its own NGXS state here. */
export const rutasCaja: Routes = [
  {
    path: '',
    providers: [provideStates([CajaState])],
    children: [
      {
        path: '',
        title: elementoPorRuta('caja').etiqueta,
        loadComponent: () => import('@modules/caja/pages/cajas/cajas').then((m) => m.Cajas),
      },
      {
        path: 'cortes',
        title: 'Cortes y arqueos',
        loadComponent: () => import('@modules/caja/pages/cortes/cortes').then((m) => m.Cortes),
      },
    ],
  },
];

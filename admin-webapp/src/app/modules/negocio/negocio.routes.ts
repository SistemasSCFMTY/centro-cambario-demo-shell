import { Routes } from '@angular/router';
import { provideStates } from '@ngxs/store';
import { NegocioState } from '@store/negocio/state/negocio.state';
import { elementoPorRuta } from '@utils/navegacion/elemento-navegacion';

/** Routes of `negocio`, loaded lazily by app.routes. The module provides its own NGXS state here. */
export const rutasNegocio: Routes = [
  {
    path: '',
    providers: [provideStates([NegocioState])],
    data: { elemento: elementoPorRuta('negocio') },
    children: [
      {
        path: '',
        title: elementoPorRuta('negocio').etiqueta,
        loadComponent: () =>
          import('@modules/negocio/pages/negocio/negocio').then((m) => m.PaginaNegocio),
      },
      {
        path: 'editar',
        title: 'Editar negocio',
        loadComponent: () =>
          import('@modules/negocio/pages/negocio-edicion/negocio-edicion').then(
            (m) => m.NegocioEdicion,
          ),
      },
      {
        path: 'sucursales/nueva',
        title: 'Nueva sucursal',
        loadComponent: () =>
          import('@modules/negocio/pages/sucursal-formulario/sucursal-formulario').then(
            (m) => m.SucursalFormulario,
          ),
      },
      {
        path: 'sucursales/:id/editar',
        title: 'Editar sucursal',
        loadComponent: () =>
          import('@modules/negocio/pages/sucursal-formulario/sucursal-formulario').then(
            (m) => m.SucursalFormulario,
          ),
      },
    ],
  },
];

import { Routes } from '@angular/router';
import { NAVEGACION } from '@data/constants/navegacion.constants';

/** Phase 1 placeholder for each module; every module swaps in its own routes as it's built. */
const rutasModulos: Routes = NAVEGACION.flatMap((grupo) => grupo.elementos).map((elemento) => ({
  path: elemento.ruta,
  title: elemento.etiqueta,
  data: { elemento },
  loadComponent: () => import('@modules/pendiente/pagina-pendiente').then((m) => m.PaginaPendiente),
}));

/** No guards until Phase 2 (plans/00 Auth): every route stays open. */
export const routes: Routes = [
  {
    path: 'acceso',
    loadComponent: () => import('@layout/marco-acceso/marco-acceso').then((m) => m.MarcoAcceso),
    children: [
      {
        path: '',
        title: 'Iniciar sesión',
        loadComponent: () =>
          import('@modules/acceso/inicio-sesion/inicio-sesion').then((m) => m.InicioSesion),
      },
      {
        path: 'verificacion',
        title: 'Verificación',
        loadComponent: () =>
          import('@modules/acceso/verificacion/verificacion').then((m) => m.Verificacion),
      },
    ],
  },
  {
    path: '',
    loadComponent: () => import('@layout/marco/marco').then((m) => m.Marco),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      ...rutasModulos,
      {
        path: '**',
        title: 'Página no encontrada',
        loadComponent: () =>
          import('@modules/no-encontrado/no-encontrado').then((m) => m.NoEncontrado),
      },
    ],
  },
];

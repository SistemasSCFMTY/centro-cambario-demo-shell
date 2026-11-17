import { Routes } from '@angular/router';
import { NAVEGACION } from '@data/constants/navegacion.constants';

/** Modules built so far load their own routes (and NGXS states). The rest keep the Phase 1 placeholder. */
const MODULOS_CON_RUTAS: Record<string, () => Promise<Routes>> = {
  operaciones: () =>
    import('@modules/operaciones/operaciones.routes').then((m) => m.rutasOperaciones),
  caja: () => import('@modules/caja/caja.routes').then((m) => m.rutasCaja),
  movimientos: () =>
    import('@modules/movimientos/movimientos.routes').then((m) => m.rutasMovimientos),
  clientes: () => import('@modules/clientes/clientes.routes').then((m) => m.rutasClientes),
  negocio: () => import('@modules/negocio/negocio.routes').then((m) => m.rutasNegocio),
};

const rutasModulos: Routes = NAVEGACION.flatMap((grupo) => grupo.elementos).map((elemento) => {
  const cargarRutas = MODULOS_CON_RUTAS[elemento.ruta];
  return cargarRutas
    ? { path: elemento.ruta, loadChildren: cargarRutas }
    : {
        path: elemento.ruta,
        title: elemento.etiqueta,
        data: { elemento },
        loadComponent: () =>
          import('@modules/pendiente/pagina-pendiente').then((m) => m.PaginaPendiente),
      };
});

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

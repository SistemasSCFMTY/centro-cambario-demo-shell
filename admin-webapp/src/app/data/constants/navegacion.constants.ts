import { GrupoNavegacion } from '@data/interfaces/grupo-navegacion';
import {
  lucideArrowLeftRight,
  lucideBanknote,
  lucideBookOpen,
  lucideBuilding2,
  lucideFileChartColumn,
  lucideLayoutDashboard,
  lucidePalette,
  lucideScrollText,
  lucideShieldCheck,
  lucideTrendingUp,
  lucideTruck,
  lucideUserCog,
  lucideUsers,
} from '@ng-icons/lucide';

/** Every admin module (plans/00 Scope). The sidebar and the routes are both built from this list. */
export const NAVEGACION: readonly GrupoNavegacion[] = [
  {
    etiqueta: null,
    elementos: [
      {
        etiqueta: 'Inicio',
        ruta: 'inicio',
        icono: 'lucideLayoutDashboard',
        descripcion: 'Volumen, margen y actividad del día por sucursal y divisa.',
      },
    ],
  },
  {
    etiqueta: 'Operación',
    elementos: [
      {
        etiqueta: 'Operaciones',
        ruta: 'operaciones',
        icono: 'lucideArrowLeftRight',
        descripcion: 'Compras y ventas de divisas de todas las sucursales.',
      },
      {
        etiqueta: 'Tipos de cambio',
        ruta: 'tipos-cambio',
        icono: 'lucideTrendingUp',
        descripcion: 'Tipos de cambio vigentes por sucursal y divisa contra el peso.',
      },
      {
        etiqueta: 'Caja',
        ruta: 'caja',
        icono: 'lucideBanknote',
        descripcion: 'Cajas y bóveda de cada sucursal: turnos, saldos y conteos.',
      },
      {
        etiqueta: 'Movimientos',
        ruta: 'movimientos',
        icono: 'lucideTruck',
        descripcion: 'Traspasos, traslados de valores y dotaciones de efectivo.',
      },
      {
        etiqueta: 'Clientes',
        ruta: 'clientes',
        icono: 'lucideUsers',
        descripcion: 'Expedientes de personas físicas y morales.',
      },
    ],
  },
  {
    etiqueta: 'Control',
    elementos: [
      {
        etiqueta: 'Contabilidad',
        ruta: 'contabilidad',
        icono: 'lucideBookOpen',
        descripcion: 'Saldos por sucursal y divisa, cortes y totales.',
      },
      {
        etiqueta: 'Reportes',
        ruta: 'reportes',
        icono: 'lucideFileChartColumn',
        descripcion: 'Reportes consolidados y exportaciones.',
      },
      {
        etiqueta: 'Bitácora',
        ruta: 'bitacora',
        icono: 'lucideScrollText',
        descripcion: 'Registro de auditoría de las acciones en el sistema.',
      },
    ],
  },
  {
    etiqueta: 'Administración',
    elementos: [
      {
        etiqueta: 'Negocio',
        ruta: 'negocio',
        icono: 'lucideBuilding2',
        descripcion: 'Datos generales y legales del centro cambiario y sus sucursales.',
      },
      {
        etiqueta: 'Administradores',
        ruta: 'usuarios-admin',
        icono: 'lucideShieldCheck',
        descripcion: 'Usuarios con acceso a la consola de administración.',
      },
      {
        etiqueta: 'Cajeros',
        ruta: 'usuarios-cajero',
        icono: 'lucideUserCog',
        descripcion: 'Usuarios que operan en ventanilla.',
      },
      {
        etiqueta: 'Apariencia',
        ruta: 'apariencia',
        icono: 'lucidePalette',
        descripcion: 'Nombre, logotipo y colores de la marca.',
      },
    ],
  },
];

export const ICONOS_NAVEGACION = {
  lucideArrowLeftRight,
  lucideBanknote,
  lucideBookOpen,
  lucideBuilding2,
  lucideFileChartColumn,
  lucideLayoutDashboard,
  lucidePalette,
  lucideScrollText,
  lucideShieldCheck,
  lucideTrendingUp,
  lucideTruck,
  lucideUserCog,
  lucideUsers,
};

import { Cajero } from '@data/interfaces/cajero';

/** Clearly fake counter staff, two per active sucursal and one in the sucursal dada de baja. */
export const CAJEROS: readonly Cajero[] = [
  {
    id: 'cajero-01',
    nombreCompleto: 'Mariana Solís Cavazos',
    correo: 'mariana.solis@centrocambiariodemo.example',
    sucursalId: 'suc-mty',
    activo: true,
  },
  {
    id: 'cajero-02',
    nombreCompleto: 'Rodrigo Elizondo Treviño',
    correo: 'rodrigo.elizondo@centrocambiariodemo.example',
    sucursalId: 'suc-mty',
    activo: true,
  },
  {
    id: 'cajero-03',
    nombreCompleto: 'Paola Ibarra Núñez',
    correo: 'paola.ibarra@centrocambiariodemo.example',
    sucursalId: 'suc-gdl',
    activo: true,
  },
  {
    id: 'cajero-04',
    nombreCompleto: 'Emilio Robles Duarte',
    correo: 'emilio.robles@centrocambiariodemo.example',
    sucursalId: 'suc-gdl',
    activo: true,
  },
  {
    id: 'cajero-05',
    nombreCompleto: 'Karla Montes Aguirre',
    correo: 'karla.montes@centrocambiariodemo.example',
    sucursalId: 'suc-tij',
    activo: false,
  },
];

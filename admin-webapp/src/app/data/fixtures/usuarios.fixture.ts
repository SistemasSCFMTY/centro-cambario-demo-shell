import { UsuarioPrueba } from '@data/interfaces/usuario-prueba';

/**
 * Phase 1 only: the two test superadmins from plans/00, checked in the browser by the simulated API
 * (interceptors/simulacion-api). Phase 2 moves auth to backend-api (own users table + OTP) and this file goes away.
 */
export const USUARIOS_PRUEBA: readonly UsuarioPrueba[] = [
  {
    id: 'usr-0001',
    nombre: 'Eduardo',
    apellidos: '',
    correo: 'eduardo@testing.com',
    rol: 'SUPERADMIN',
    contrasena: 'Password123#!',
  },
  {
    id: 'usr-0002',
    nombre: 'Fernando',
    apellidos: '',
    correo: 'fernando@testing.com',
    rol: 'SUPERADMIN',
    contrasena: 'Password123#!',
  },
];

/** Phase 1: the OTP is always this code (plans/00 Test users). */
export const CODIGO_OTP_PRUEBA = '0000';

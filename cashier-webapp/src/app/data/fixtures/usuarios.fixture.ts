import { UsuarioPrueba } from '@data/interfaces/usuario-prueba';

/**
 * Phase 1 only: the test cajero (plans/00 Test users), checked in the browser by the simulated API
 * (interceptors/simulacion-api). Only CAJERO signs in to the cashier app (interim access rule).
 * Phase 2 moves auth to backend-api (own users table + OTP) and this file goes away.
 */
export const USUARIOS_PRUEBA: readonly UsuarioPrueba[] = [
  {
    id: 'usr-0101',
    nombre: 'Cajero',
    apellidos: 'de Prueba',
    correo: 'cajero@testing.com',
    rol: 'CAJERO',
    contrasena: 'Password123#!',
  },
];

/** Phase 1: the OTP is always this code (plans/00 Test users). */
export const CODIGO_OTP_PRUEBA = '0000';

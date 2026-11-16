import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeEsMx from '@angular/common/locales/es-MX';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';
import { CLAVE_ALMACEN_MODO } from '@data/constants/tema.constants';
import { simulacionApiInterceptor } from '@interceptors/simulacion-api/simulacion-api.interceptor';
import { provideStore, Store } from '@ngxs/store';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { EstrategiaTitulo } from '@services/navegacion/estrategia-titulo';
import { provideSpartanHlm } from '@spartan-ng/helm/utils';
import { AutenticacionState } from '@store/autenticacion/state/autenticacion.state';
import { SesionState } from '@store/sesion/state/sesion.state';
import { CargarMarca } from '@store/tema/actions/tema.actions';
import { TemaState } from '@store/tema/state/tema.state';
import { routes } from './app.routes';

registerLocaleData(localeEsMx);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // The shell scrolls its content pane, not the window, so Marco resets that pane on navigation.
    provideRouter(routes, withComponentInputBinding()),
    // Phase 1: the interceptor answers backend-api in the browser. Phase 2 drops it.
    provideHttpClient(withInterceptors([simulacionApiInterceptor])),
    { provide: TitleStrategy, useClass: EstrategiaTitulo },
    { provide: LOCALE_ID, useValue: 'es-MX' },
    provideSpartanHlm(),
    // App state lives in NGXS (plans/00). Only the theme mode persists, in localStorage.
    provideStore(
      [TemaState, SesionState, AutenticacionState],
      { developmentMode: isDevMode() },
      withNgxsStoragePlugin({ keys: [CLAVE_ALMACEN_MODO] }),
    ),
    // Branding before first render, so the name and colors never flash the defaults.
    provideAppInitializer(() => inject(Store).dispatch(new CargarMarca())),
  ],
};

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { simulacionApiInterceptor } from '@interceptors/simulacion-api/simulacion-api.interceptor';
import { provideStore, Store } from '@ngxs/store';
import { IniciarSesion, VerificarCodigo } from '@store/autenticacion/actions/autenticacion.actions';
import { AutenticacionState } from '@store/autenticacion/state/autenticacion.state';
import { CerrarSesion } from '@store/sesion/actions/sesion.actions';
import { SesionState } from '@store/sesion/state/sesion.state';
import { firstValueFrom } from 'rxjs';

describe('AutenticacionState (Phase 1, against the simulated API)', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore([AutenticacionState, SesionState]),
        provideHttpClient(withInterceptors([simulacionApiInterceptor])),
      ],
    });
    store = TestBed.inject(Store);
  });

  const iniciar = (contrasena: string) =>
    firstValueFrom(
      store.dispatch(new IniciarSesion({ correo: 'Cajero@testing.com ', contrasena })),
      { defaultValue: undefined },
    );

  it('refuses a wrong password without starting the OTP step', async () => {
    await iniciar('incorrecta');
    expect(store.selectSnapshot(AutenticacionState.reto)).toBeNull();
    expect(store.selectSnapshot(AutenticacionState.error)).toBe(
      'El correo o la contraseña no son correctos.',
    );
  });

  it('starts the OTP step, refuses a wrong code, then signs in with 0000', async () => {
    await iniciar('Password123#!');
    const reto = store.selectSnapshot(AutenticacionState.reto);
    expect(reto?.correoEnmascarado).toBe('c••••o@testing.com');
    expect(reto?.longitudCodigo).toBe(4);

    await firstValueFrom(store.dispatch(new VerificarCodigo('1234')), { defaultValue: undefined });
    expect(store.selectSnapshot(SesionState.iniciada)).toBe(false);
    expect(store.selectSnapshot(AutenticacionState.error)).toContain('no es correcto');

    await firstValueFrom(store.dispatch(new VerificarCodigo('0000')), { defaultValue: undefined });
    expect(store.selectSnapshot(SesionState.usuario)?.rol).toBe('CAJERO');
    expect(store.selectSnapshot(SesionState.nombreCompleto)).toBe('Cajero de Prueba');
    expect(store.selectSnapshot(AutenticacionState.reto)).toBeNull();

    store.dispatch(new CerrarSesion());
    expect(store.selectSnapshot(SesionState.iniciada)).toBe(false);
  });
});

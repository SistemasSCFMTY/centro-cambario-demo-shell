import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { simulacionApiInterceptor } from '@interceptors/simulacion-api/simulacion-api.interceptor';
import { provideStore, Store } from '@ngxs/store';
import { CargarSucursalesCaja } from '@store/caja/actions/caja.actions';
import { CajaState } from '@store/caja/state/caja.state';
import { firstValueFrom } from 'rxjs';

describe('CajaState sucursales', () => {
  it('reloads the sucursal catalog on every dispatch, so altas and bajas show up', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideStore([CajaState]),
        provideHttpClient(withInterceptors([simulacionApiInterceptor])),
      ],
    });
    const store = TestBed.inject(Store);
    await firstValueFrom(store.dispatch(new CargarSucursalesCaja()), { defaultValue: undefined });
    store.reset({ ...store.snapshot(), caja: { ...store.snapshot().caja, sucursales: [] } });
    await firstValueFrom(store.dispatch(new CargarSucursalesCaja()), { defaultValue: undefined });
    expect(store.selectSnapshot(CajaState.sucursales).length).toBeGreaterThan(0);
  });
});

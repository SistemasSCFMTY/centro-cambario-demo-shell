import { backLinkParams, backState, pathWithoutQuery } from './back-link';

describe('back-link', () => {
  it('drops the query string and fragment from a URL', () => {
    expect(pathWithoutQuery('/operaciones?vista=pendientes&pagina=2')).toBe('/operaciones');
    expect(pathWithoutQuery('/negocio#x')).toBe('/negocio');
    expect(pathWithoutQuery('/clientes')).toBe('/clientes');
  });

  it('builds the state from the list URL and its params', () => {
    expect(backState('/operaciones?vista=pendientes', { vista: 'pendientes' })).toEqual({
      back: { path: '/operaciones', params: { vista: 'pendientes' } },
    });
  });

  it('returns the list params when the state came from the link target', () => {
    const state = backState('/operaciones?vista=pendientes', { vista: 'pendientes' });
    expect(backLinkParams(state, '/operaciones', null)).toEqual({ vista: 'pendientes' });
  });

  it('falls back when the state came from another list or is missing or malformed', () => {
    const fallback = { tab: 'sucursales' };
    const other = backState('/operaciones', { vista: 'hoy' });
    expect(backLinkParams(other, '/clientes', fallback)).toBe(fallback);
    expect(backLinkParams(null, '/clientes', fallback)).toBe(fallback);
    expect(backLinkParams({ navigationId: 3 }, '/clientes', null)).toBeNull();
    expect(backLinkParams({ back: { path: 5 } }, '/clientes', null)).toBeNull();
  });
});

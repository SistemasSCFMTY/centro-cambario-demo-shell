import { normalizar } from '@utils/texto/normalizar';

describe('normalizar', () => {
  it('drops accents and case', () => {
    expect(normalizar('  Álvaro Núñez ')).toBe('alvaro nunez');
  });

  it('keeps the ñ base letter readable', () => {
    expect(normalizar('Peña')).toBe('pena');
  });
});

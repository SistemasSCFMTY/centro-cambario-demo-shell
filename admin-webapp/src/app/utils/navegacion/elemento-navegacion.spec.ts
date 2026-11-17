import { elementoPorRuta } from '@utils/navegacion/elemento-navegacion';

describe('elementoPorRuta', () => {
  it('finds a nav entry', () => {
    expect(elementoPorRuta('operaciones').etiqueta).toBe('Operaciones');
  });

  it('throws for an unknown route', () => {
    expect(() => elementoPorRuta('nada')).toThrow();
  });
});

import { domicilioEnLinea } from '@utils/negocio/domicilio';

describe('domicilioEnLinea', () => {
  it('joins the parts in postal order', () => {
    expect(
      domicilioEnLinea({
        calle: 'Avenida Constitución',
        numeroExterior: '1450',
        numeroInterior: 'Local 3',
        colonia: 'Centro',
        municipio: 'Monterrey',
      }),
    ).toBe('Avenida Constitución 1450, Local 3, Centro, Monterrey');
  });

  it('skips the interior number and any empty part', () => {
    expect(
      domicilioEnLinea({
        calle: 'Paseo de los Héroes',
        numeroExterior: '9580',
        numeroInterior: null,
        colonia: 'Zona Río',
        municipio: '',
      }),
    ).toBe('Paseo de los Héroes 9580, Zona Río');
  });

  it('is empty when there is nothing', () => {
    expect(
      domicilioEnLinea({
        calle: '',
        numeroExterior: '',
        numeroInterior: null,
        colonia: '',
        municipio: '',
      }),
    ).toBe('');
  });
});

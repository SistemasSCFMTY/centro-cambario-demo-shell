import { aTitulo } from '@utils/texto/titulo';

describe('aTitulo', () => {
  it('capitalizes each word', () => {
    expect(aTitulo('SAN PEDRO GARZA GARCIA')).toBe('San Pedro Garza Garcia');
  });

  it('keeps small connectors lowercase, except at the start', () => {
    expect(aTitulo('MIER Y NORIEGA')).toBe('Mier y Noriega');
    expect(aTitulo('LOS ALDAMAS')).toBe('Los Aldamas');
  });

  it('keeps abbreviations with their dot', () => {
    expect(aTitulo('DR. ARROYO')).toBe('Dr. Arroyo');
  });

  it('collapses extra spaces and handles blank input', () => {
    expect(aTitulo('  CIENEGA   DE FLORES ')).toBe('Cienega de Flores');
    expect(aTitulo('')).toBe('');
  });
});

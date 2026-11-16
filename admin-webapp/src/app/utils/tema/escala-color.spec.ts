import { TONOS } from '@data/constants/tema.constants';
import { contraste, derivarEscala, textoSobre } from '@utils/tema/escala-color';

describe('derivarEscala', () => {
  const luminosidad = (hex: string) => contraste(hex, '#000000');

  it('returns the twelve shades with the base as 500', () => {
    const escala = derivarEscala('#4766F0');
    expect(Object.keys(escala)).toEqual([...TONOS]);
    expect(escala['500']).toBe('#4766f0');
    for (const valor of Object.values(escala)) expect(valor).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('gets darker from 50 to 1000 for light, mid and dark bases', () => {
    for (const base of ['#f5d90a', '#12a98c', '#1d2961']) {
      const escala = derivarEscala(base);
      const valores = TONOS.map((t) => luminosidad(escala[t]));
      for (let i = 1; i < valores.length; i++) {
        expect(valores[i]).toBeLessThanOrEqual(valores[i - 1]);
      }
    }
  });

  it('rejects anything but #rrggbb', () => {
    expect(() => derivarEscala('blue')).toThrow();
  });
});

describe('textoSobre', () => {
  it('picks white on a dark fill and the dark shade on a light one', () => {
    expect(textoSobre('#2f43aa', '#0e1433')).toBe('#ffffff');
    expect(textoSobre('#f5d90a', '#2a2400')).toBe('#2a2400');
  });
});

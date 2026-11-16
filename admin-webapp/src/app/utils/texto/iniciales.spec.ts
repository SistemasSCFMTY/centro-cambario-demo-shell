import { iniciales } from '@utils/texto/iniciales';

describe('iniciales', () => {
  it('takes the first two words', () => {
    expect(iniciales('Centro Cambiario Demo')).toBe('CC');
  });

  it('skips short lowercase connectors', () => {
    expect(iniciales('María de la Luz')).toBe('ML');
  });

  it('handles one word and blank input', () => {
    expect(iniciales(' eduardo ')).toBe('E');
    expect(iniciales('')).toBe('');
  });
});

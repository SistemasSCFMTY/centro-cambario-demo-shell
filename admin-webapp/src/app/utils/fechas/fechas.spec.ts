import {
  diaHabilAnterior,
  esDiaHabil,
  fechaHoraLocalIso,
  fechaLocalIso,
  formatearFecha,
  formatearFechaHora,
  formatearHora,
  hoyIso,
  sumarDias,
} from '@utils/fechas/fechas';

describe('fechas', () => {
  it('builds local ISO strings', () => {
    const fecha = new Date(2026, 10, 16, 9, 5, 7);
    expect(fechaLocalIso(fecha)).toBe('2026-11-16');
    expect(fechaHoraLocalIso(fecha)).toBe('2026-11-16T09:05:07');
    expect(hoyIso(fecha)).toBe('2026-11-16');
  });

  it('moves across month and year edges', () => {
    expect(sumarDias('2026-11-30', 1)).toBe('2026-12-01');
    expect(sumarDias('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('knows business days', () => {
    expect(esDiaHabil('2026-11-16')).toBe(true); // Monday
    expect(esDiaHabil('2026-11-14')).toBe(false); // Saturday
    expect(esDiaHabil('2026-11-15')).toBe(false); // Sunday
  });

  it('finds the previous business day', () => {
    expect(diaHabilAnterior('2026-11-17')).toBe('2026-11-16');
    expect(diaHabilAnterior('2026-11-16')).toBe('2026-11-13'); // Monday → Friday
    expect(diaHabilAnterior('2026-11-15')).toBe('2026-11-13'); // Sunday → Friday
  });

  it('formats dates as DD/MM/AAAA', () => {
    expect(formatearFecha('2026-11-16')).toBe('16/11/2026');
    expect(formatearFecha('2026-11-16T09:30:00')).toBe('16/11/2026');
    expect(formatearHora('2026-11-16T09:30:00')).toBe('09:30');
    expect(formatearFechaHora('2026-11-16T09:30:00')).toBe('16/11/2026 09:30');
    expect(formatearFechaHora('2026-11-16')).toBe('16/11/2026');
  });

  it('shows a dash for empty dates', () => {
    expect(formatearFecha(null)).toBe('—');
    expect(formatearFechaHora('')).toBe('—');
    expect(formatearHora(undefined)).toBe('—');
  });
});

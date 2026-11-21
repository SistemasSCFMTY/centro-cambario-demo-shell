import { CALENDAR_ES, DATE_PICKER_ES, dateFromIso, isoFromText } from './calendar';

describe('calendar', () => {
  it('reads an ISO date as local noon and rejects junk', () => {
    const date = dateFromIso('2026-11-16');
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(10);
    expect(date?.getDate()).toBe(16);
    expect(date?.getHours()).toBe(12);
    expect(dateFromIso('')).toBeUndefined();
    expect(dateFromIso('16/11/2026')).toBeUndefined();
    expect(dateFromIso(null)).toBeUndefined();
  });

  it('parses dd/mm/aaaa and rejects impossible dates', () => {
    expect(isoFromText('16/11/2026')).toBe('2026-11-16');
    expect(isoFromText('1-2-2026')).toBe('2026-02-01');
    expect(isoFromText('31/02/2026')).toBeNull();
    expect(isoFromText('2026-11-16')).toBeNull();
  });

  it('speaks Spanish and starts the week on Monday', () => {
    expect(CALENDAR_ES.formatHeader(10, 2026)).toBe('Noviembre de 2026');
    expect(CALENDAR_ES.formatWeekdayName(3)).toBe('mi');
    expect(CALENDAR_ES.labelWeekday(6)).toBe('sábado');
    expect(CALENDAR_ES.months()[0]).toBe('Enero');
    expect(CALENDAR_ES.firstDayOfWeek()).toBe(1);
  });

  it('shows and parses dd/mm/aaaa in the picker', () => {
    expect(DATE_PICKER_ES.formatDate?.(new Date(2026, 10, 16, 12))).toBe('16/11/2026');
    expect(DATE_PICKER_ES.parseDate?.('16/11/2026')?.getDate()).toBe(16);
    expect(DATE_PICKER_ES.parseDate?.('x')).toBeNull();
  });
});

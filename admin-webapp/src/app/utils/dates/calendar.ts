import {
  CALENDAR_YEARS_AHEAD,
  CALENDAR_YEARS_BACK,
  FIRST_DAY_OF_WEEK,
  MONTHS,
  WEEKDAYS,
  WEEKDAYS_SHORT,
} from '@data/constants/calendar.constants';
import { BrnCalendarI18n } from '@spartan-ng/brain/calendar';
import { HlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { fechaLocalIso, formatearFecha } from '@utils/fechas/fechas';

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** A local Date at noon of `2026-11-16`; `undefined` for an empty or malformed value. */
export function dateFromIso(iso: string | null | undefined): Date | undefined {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso?.slice(0, 10) ?? '');
  if (!parts) return undefined;
  const date = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]), 12);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** `16/11/2026` (also typed with `-` or `.`) → `2026-11-16`; `null` when it isn't a real date. */
export function isoFromText(text: string): string | null {
  const parts = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(text.trim());
  if (!parts) return null;
  const [day, month, year] = [Number(parts[1]), Number(parts[2]), Number(parts[3])];
  const date = new Date(year, month - 1, day, 12);
  return date.getDate() === day && date.getMonth() === month - 1 ? fechaLocalIso(date) : null;
}

/** The Spanish (Mexico) calendar: month and weekday names, Monday first. */
export const CALENDAR_ES: BrnCalendarI18n = {
  formatWeekdayName: (index) => WEEKDAYS_SHORT[index],
  labelWeekday: (index) => WEEKDAYS[index],
  months: () => [...MONTHS].map(capitalize) as ReturnType<BrnCalendarI18n['months']>,
  years: (from, to) => {
    const current = new Date().getFullYear();
    const first = from ?? current - CALENDAR_YEARS_BACK;
    const last = to ?? current + CALENDAR_YEARS_AHEAD;
    return Array.from({ length: last - first + 1 }, (_, i) => first + i);
  },
  formatHeader: (month, year) => `${capitalize(MONTHS[month])} de ${year}`,
  formatMonth: (month) => capitalize(MONTHS[month].slice(0, 3)),
  formatYear: (year) => String(year),
  labelPrevious: () => 'Mes anterior',
  labelNext: () => 'Mes siguiente',
  firstDayOfWeek: () => FIRST_DAY_OF_WEEK,
};

/** The date picker shows and takes `dd/mm/aaaa`, like every read view, and closes on a pick. */
export const DATE_PICKER_ES: Partial<HlmDatePickerConfig<Date>> = {
  autoCloseOnSelect: true,
  formatDate: (date) => formatearFecha(fechaLocalIso(date)),
  formatInputDate: (date) => formatearFecha(fechaLocalIso(date)),
  parseDate: (text) => dateFromIso(isoFromText(text)) ?? null,
};

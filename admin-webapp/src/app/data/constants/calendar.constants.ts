/** Month names, January first (es-MX, lowercase as Spanish writes them). */
export const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const;

/** Weekday names, Sunday first (the calendar's index). */
export const WEEKDAYS = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
] as const;

/** Two-letter weekday headers, Sunday first. */
export const WEEKDAYS_SHORT = ['do', 'lu', 'ma', 'mi', 'ju', 'vi', 'sá'] as const;

/** Mexico starts the week on Monday. */
export const FIRST_DAY_OF_WEEK = 1;

/** How far the year list reaches back (a founding date) and ahead of the current year. */
export const CALENDAR_YEARS_BACK = 100;
export const CALENDAR_YEARS_AHEAD = 10;

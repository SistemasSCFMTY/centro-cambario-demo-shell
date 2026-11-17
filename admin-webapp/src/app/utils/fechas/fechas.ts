const VACIO = '—';
const DIA_MS = 86_400_000;

const dosDigitos = (n: number) => String(n).padStart(2, '0');

/** `2026-11-16` from a local Date. */
export function fechaLocalIso(fecha: Date): string {
  return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;
}

/** `2026-11-16T09:30:00` from a local Date: the app stores local, zone-less date-times. */
export function fechaHoraLocalIso(fecha: Date): string {
  const hora = `${dosDigitos(fecha.getHours())}:${dosDigitos(fecha.getMinutes())}:${dosDigitos(fecha.getSeconds())}`;
  return `${fechaLocalIso(fecha)}T${hora}`;
}

export function hoyIso(ahora: Date = new Date()): string {
  return fechaLocalIso(ahora);
}

/** A Date at local noon of an ISO date (noon keeps day math clear of DST edges). */
function aFecha(iso: string): Date {
  const [anio, mes, dia] = iso.slice(0, 10).split('-').map(Number);
  return new Date(anio, mes - 1, dia, 12);
}

/** `iso` moved by `dias` (negative goes back). */
export function sumarDias(iso: string, dias: number): string {
  return fechaLocalIso(new Date(aFecha(iso).getTime() + dias * DIA_MS));
}

/** Monday to Friday. Bank holidays aren't modeled in Phase 1. */
export function esDiaHabil(iso: string): boolean {
  const dia = aFecha(iso).getDay();
  return dia !== 0 && dia !== 6;
}

/** The business day before `iso`: the day whose FIX applies to an operation made on `iso`. */
export function diaHabilAnterior(iso: string): string {
  let candidato = sumarDias(iso, -1);
  while (!esDiaHabil(candidato)) candidato = sumarDias(candidato, -1);
  return candidato;
}

/** `16/11/2026` from `2026-11-16[T…]`; `—` when empty. */
export function formatearFecha(iso: string | null | undefined): string {
  if (!iso) return VACIO;
  const [anio, mes, dia] = iso.slice(0, 10).split('-');
  return anio && mes && dia ? `${dia}/${mes}/${anio}` : VACIO;
}

/** `09:30` from `…T09:30:00`. */
export function formatearHora(iso: string | null | undefined): string {
  return iso && iso.length >= 16 ? iso.slice(11, 16) : VACIO;
}

/** `16/11/2026 09:30`; `—` when empty. */
export function formatearFechaHora(iso: string | null | undefined): string {
  if (!iso) return VACIO;
  return iso.length >= 16 ? `${formatearFecha(iso)} ${formatearHora(iso)}` : formatearFecha(iso);
}

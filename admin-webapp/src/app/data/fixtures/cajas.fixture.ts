import { Caja } from '@data/interfaces/caja';
import { ExistenciaCaja } from '@data/interfaces/existencia-caja';
import { CodigoDivisa } from '@data/types/divisa.types';
import { hoyIso } from '@utils/fechas/fechas';

const HOY = hoyIso();

/** Drawers and vaults per sucursal. Open ones carry today's session; the sucursal dada de baja has none. */
export const CAJAS: readonly Caja[] = [
  {
    id: 'caja-mty-bov',
    sucursalId: 'suc-mty',
    clave: 'BOV-MTY',
    nombre: 'Bóveda Monterrey Centro',
    tipo: 'BOVEDA',
    activa: true,
    responsableId: null,
    abiertaEn: null,
  },
  {
    id: 'caja-mty-1',
    sucursalId: 'suc-mty',
    clave: 'CJ-MTY-1',
    nombre: 'Caja 1',
    tipo: 'CAJA',
    activa: true,
    responsableId: 'cajero-01',
    abiertaEn: `${HOY}T08:45:00`,
  },
  {
    id: 'caja-mty-2',
    sucursalId: 'suc-mty',
    clave: 'CJ-MTY-2',
    nombre: 'Caja 2',
    tipo: 'CAJA',
    activa: true,
    responsableId: 'cajero-02',
    abiertaEn: `${HOY}T09:10:00`,
  },
  {
    id: 'caja-gdl-bov',
    sucursalId: 'suc-gdl',
    clave: 'BOV-GDL',
    nombre: 'Bóveda Guadalajara Providencia',
    tipo: 'BOVEDA',
    activa: true,
    responsableId: null,
    abiertaEn: null,
  },
  {
    id: 'caja-gdl-1',
    sucursalId: 'suc-gdl',
    clave: 'CJ-GDL-1',
    nombre: 'Caja 1',
    tipo: 'CAJA',
    activa: true,
    responsableId: 'cajero-03',
    abiertaEn: `${HOY}T08:55:00`,
  },
  {
    id: 'caja-gdl-2',
    sucursalId: 'suc-gdl',
    clave: 'CJ-GDL-2',
    nombre: 'Caja 2',
    tipo: 'CAJA',
    activa: true,
    responsableId: 'cajero-04',
    abiertaEn: `${HOY}T09:20:00`,
  },
  {
    id: 'caja-tij-bov',
    sucursalId: 'suc-tij',
    clave: 'BOV-TIJ',
    nombre: 'Bóveda Tijuana Río',
    tipo: 'BOVEDA',
    activa: false,
    responsableId: null,
    abiertaEn: null,
  },
  {
    id: 'caja-tij-1',
    sucursalId: 'suc-tij',
    clave: 'CJ-TIJ-1',
    nombre: 'Caja 1',
    tipo: 'CAJA',
    activa: false,
    responsableId: null,
    abiertaEn: null,
  },
];

/** Saldo of a small drawer per currency; each caja scales it by its own factor. */
const SALDO_BASE: Record<CodigoDivisa, number> = {
  MXN: 180000,
  USD: 6500,
  EUR: 2800,
  JPY: 420000,
  CNY: 9000,
  KRW: 3600000,
};

const FACTOR_SALDO: Record<string, number> = {
  'caja-mty-bov': 8,
  'caja-mty-1': 1,
  'caja-mty-2': 0.8,
  'caja-gdl-bov': 5,
  'caja-gdl-1': 0.9,
  'caja-gdl-2': 0.6,
  'caja-tij-bov': 0.1,
  'caja-tij-1': 0.05,
};

const DIVISAS_CAJA: readonly CodigoDivisa[] = ['MXN', 'USD', 'EUR', 'JPY', 'CNY', 'KRW'];

/** What every caja holds right now, per currency. */
export const EXISTENCIAS_CAJA: readonly ExistenciaCaja[] = CAJAS.flatMap((caja) =>
  DIVISAS_CAJA.map((divisa) => ({
    cajaId: caja.id,
    divisa,
    saldo: Math.round((SALDO_BASE[divisa] * FACTOR_SALDO[caja.id]) / 10) * 10,
  })),
);

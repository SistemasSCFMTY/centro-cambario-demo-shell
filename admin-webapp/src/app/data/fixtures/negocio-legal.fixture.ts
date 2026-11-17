import { DatosLegales } from '@data/interfaces/datos-legales-negocio';
import { DocumentoLegal } from '@data/interfaces/documento-legal-negocio';
import { hoyIso, sumarDias } from '@utils/fechas/fechas';

/** Legal data of the fake centro (plans/04 Legal). Keys have the right shape; none is a real registration. */
export const DATOS_LEGALES: DatosLegales = {
  claveOrganoSupervisor: '40-002',
  claveCentro: '04200123',
  claveEntidad: '27-001',
  numeroRegistro: 'CC-2021-0457',
  fechaRegistro: '2021-04-12',
  dictamenNumero: 'DT-PLD-2025-118',
  dictamenEmision: sumarDias(hoyIso(), -325),
  dictamenVigencia: sumarDias(hoyIso(), 40),
  escrituraNumero: '48,215',
  escrituraFecha: '2021-02-22',
  notarioNombre: 'Lic. Ernesto Garza Villarreal',
  notarioNumero: '112',
  notarioEntidad: 'Nuevo León',
  folioMercantil: 'N-2021-004587',
  representanteNombre: 'Alejandro Treviño Montemayor',
  representanteRfc: 'TEMA800714KL5',
  representanteCurp: 'TEMA800714HNLRNL09',
  poderEscrituraNumero: '48,216',
  poderFecha: '2021-02-22',
  poderNotario: 'Lic. Ernesto Garza Villarreal, notaría 112',
  oficialUsuarioId: 'usr-0002',
  oficialFechaDesignacion: '2021-03-01',
  oficialFechaNotificacion: '2021-03-18',
};

/** Documents on file; the Manual de PLD hasn't been uploaded yet, so the tab shows a pending one. */
export const DOCUMENTOS_LEGALES: readonly DocumentoLegal[] = [
  {
    id: 'doc-acta',
    tipo: 'ACTA_CONSTITUTIVA',
    archivo: 'acta-constitutiva.pdf',
    tamanoKb: 2140,
    fecha: '2021-03-01',
    vigencia: null,
  },
  {
    id: 'doc-poder',
    tipo: 'PODER_REPRESENTANTE',
    archivo: 'poder-representante-legal.pdf',
    tamanoKb: 1385,
    fecha: '2021-03-01',
    vigencia: null,
  },
  {
    id: 'doc-fiscal',
    tipo: 'CONSTANCIA_FISCAL',
    archivo: 'constancia-situacion-fiscal.pdf',
    tamanoKb: 312,
    fecha: sumarDias(hoyIso(), -90),
    vigencia: sumarDias(hoyIso(), 270),
  },
  {
    id: 'doc-registro',
    tipo: 'CONSTANCIA_REGISTRO',
    archivo: 'constancia-registro.pdf',
    tamanoKb: 466,
    fecha: '2021-04-12',
    vigencia: null,
  },
  {
    id: 'doc-dictamen',
    tipo: 'DICTAMEN_TECNICO',
    archivo: 'dictamen-tecnico-pld.pdf',
    tamanoKb: 1820,
    fecha: sumarDias(hoyIso(), -325),
    vigencia: sumarDias(hoyIso(), 40),
  },
  {
    id: 'doc-manual',
    tipo: 'MANUAL_PLD',
    archivo: null,
    tamanoKb: null,
    fecha: null,
    vigencia: null,
  },
];

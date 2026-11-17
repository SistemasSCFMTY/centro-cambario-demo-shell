import { URL_API } from '@data/constants/api.constants';
import { OpcionCatalogo } from '@data/interfaces/opcion-catalogo';

/** Small lists every module's filters and forms read (not paged). */
export const RUTAS_CATALOGOS = {
  divisas: `${URL_API}/catalogos/divisas`,
  sucursales: `${URL_API}/catalogos/sucursales`,
  cajeros: `${URL_API}/catalogos/cajeros`,
  /** `?entidad=` the name of the entidad. */
  municipios: `${URL_API}/catalogos/municipios`,
  /** `?entidad=` and, to narrow it, `&municipio=`: the names. */
  localidades: `${URL_API}/catalogos/localidades`,
} as const;

/** Entidades federativas of the CNBV catalog (`plans/catalogos/entidades.json`), with proper accents. The label is stored. */
export const ENTIDADES_FEDERATIVAS: readonly OpcionCatalogo[] = [
  { clave: '01', etiqueta: 'Aguascalientes' },
  { clave: '02', etiqueta: 'Baja California' },
  { clave: '03', etiqueta: 'Baja California Sur' },
  { clave: '04', etiqueta: 'Campeche' },
  { clave: '05', etiqueta: 'Coahuila de Zaragoza' },
  { clave: '06', etiqueta: 'Colima' },
  { clave: '07', etiqueta: 'Chiapas' },
  { clave: '08', etiqueta: 'Chihuahua' },
  { clave: '09', etiqueta: 'Distrito Federal' },
  { clave: '10', etiqueta: 'Durango' },
  { clave: '11', etiqueta: 'Guanajuato' },
  { clave: '12', etiqueta: 'Guerrero' },
  { clave: '13', etiqueta: 'Hidalgo' },
  { clave: '14', etiqueta: 'Jalisco' },
  { clave: '15', etiqueta: 'México' },
  { clave: '16', etiqueta: 'Michoacán de Ocampo' },
  { clave: '17', etiqueta: 'Morelos' },
  { clave: '18', etiqueta: 'Nayarit' },
  { clave: '19', etiqueta: 'Nuevo León' },
  { clave: '20', etiqueta: 'Oaxaca' },
  { clave: '21', etiqueta: 'Puebla' },
  { clave: '22', etiqueta: 'Querétaro' },
  { clave: '23', etiqueta: 'Quintana Roo' },
  { clave: '24', etiqueta: 'San Luis Potosí' },
  { clave: '25', etiqueta: 'Sinaloa' },
  { clave: '26', etiqueta: 'Sonora' },
  { clave: '27', etiqueta: 'Tabasco' },
  { clave: '28', etiqueta: 'Tamaulipas' },
  { clave: '29', etiqueta: 'Tlaxcala' },
  { clave: '30', etiqueta: 'Veracruz de Ignacio de la Llave' },
  { clave: '31', etiqueta: 'Yucatán' },
  { clave: '32', etiqueta: 'Zacatecas' },
];

/** Words that stay lowercase inside a catalog name written in title case. */
export const PALABRAS_MENORES_TITULO: readonly string[] = [
  'de',
  'del',
  'la',
  'las',
  'los',
  'y',
  'e',
];

/**
 * How `localidades.json` writes the estado of the two entidades whose name differs from the
 * entidades catalog (normalized, lowercase, no accents). `COAHUILA` and `MICHOACAN` need no entry:
 * they are the start of `Coahuila de Zaragoza` and `Michoacán de Ocampo`.
 */
export const ALIAS_ESTADO_LOCALIDAD: Readonly<Record<string, string>> = {
  'edo de mexico': 'mexico',
  'estado de mexico': 'mexico',
};

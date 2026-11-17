import { ALIAS_ESTADO_LOCALIDAD, ENTIDADES_FEDERATIVAS } from '@data/constants/catalogos.constants';
import { OpcionCatalogo } from '@data/interfaces/opcion-catalogo';
import { RegistroLocalidad } from '@data/interfaces/registro-localidad';
import { RegistroMunicipio } from '@data/interfaces/registro-municipio';
import { aTitulo } from '@utils/texto/titulo';
import { normalizar } from '@utils/texto/normalizar';

/** The CNBV key (`19`) of an entidad by its name (`Nuevo León`), or null when the name is unknown. */
export function claveDeEntidad(entidad: string): string | null {
  const buscada = normalizar(entidad);
  return ENTIDADES_FEDERATIVAS.find((e) => normalizar(e.etiqueta) === buscada)?.clave ?? null;
}

/** Municipios of an entidad, as options whose key and label are the name in title case. */
export function municipiosDeEntidad(
  registros: readonly RegistroMunicipio[],
  entidad: string,
): OpcionCatalogo[] {
  const clave = claveDeEntidad(entidad);
  if (!clave) return [];
  return registros
    .filter((r) => r.claveEntidad === clave)
    .map((r) => aTitulo(r.descripcion))
    .filter((nombre, i, nombres) => nombres.indexOf(nombre) === i)
    .map((nombre) => ({ clave: nombre, etiqueta: nombre }));
}

/** Whether the catalog's `estado` of a localidad is this entidad (`COAHUILA` is `Coahuila de Zaragoza`). */
function esDeEntidad(estado: string | null, entidad: string): boolean {
  if (!estado) return false;
  const nombre = normalizar(estado);
  const buscado = ALIAS_ESTADO_LOCALIDAD[nombre] ?? nombre;
  const objetivo = normalizar(entidad);
  return buscado === objetivo || objetivo.startsWith(`${buscado} de `);
}

/**
 * Localidades of an entidad, narrowed to a municipio when one is given. The catalog doesn't link a
 * localidad to a municipio, so the narrowing keeps the ones whose name starts with the municipio's
 * (`MONTERREY, NL`); when none does, the whole entidad is offered so nobody is left without choices.
 */
export function localidadesDeEntidad(
  registros: readonly RegistroLocalidad[],
  entidad: string,
  municipio: string | null,
): OpcionCatalogo[] {
  const delEstado = registros.filter((r) => esDeEntidad(r.estado, entidad));
  const nombre = municipio ? normalizar(municipio) : '';
  const delMunicipio = nombre
    ? delEstado.filter((r) => normalizar(r.descripcion).startsWith(nombre))
    : [];
  return (delMunicipio.length > 0 ? delMunicipio : delEstado)
    .map((r) => ({ clave: r.clave, etiqueta: `${r.descripcion} (${r.clave})` }))
    .sort((a, b) => a.etiqueta.localeCompare(b.etiqueta));
}

/** What the catalog calls a localidad key; empty when the key isn't in it. */
export function descripcionDeLocalidad(
  registros: readonly RegistroLocalidad[],
  clave: string,
): string {
  return registros.find((r) => r.clave === clave)?.descripcion ?? '';
}

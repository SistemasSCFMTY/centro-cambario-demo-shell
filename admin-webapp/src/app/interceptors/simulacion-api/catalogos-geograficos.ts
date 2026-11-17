import { RegistroLocalidad } from '@data/interfaces/registro-localidad';
import { RegistroMunicipio } from '@data/interfaces/registro-municipio';

/**
 * The CNBV municipios and localidades, loaded on first use with `import()` so the two JSON files
 * (about 650 kB) stay out of the initial bundle: they only ship when a form asks for them. The
 * simulated backend is the only one that reads them.
 */
export async function cargarMunicipios(): Promise<readonly RegistroMunicipio[]> {
  const catalogo = await import('@data/catalogos/municipios.json');
  return catalogo.default.registros as RegistroMunicipio[];
}

export async function cargarLocalidades(): Promise<readonly RegistroLocalidad[]> {
  const catalogo = await import('@data/catalogos/localidades.json');
  return catalogo.default.registros as RegistroLocalidad[];
}

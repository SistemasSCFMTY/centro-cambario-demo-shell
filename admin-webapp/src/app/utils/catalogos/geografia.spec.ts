import { RegistroLocalidad } from '@data/interfaces/registro-localidad';
import { RegistroMunicipio } from '@data/interfaces/registro-municipio';
import {
  claveDeEntidad,
  descripcionDeLocalidad,
  localidadesDeEntidad,
  municipiosDeEntidad,
} from '@utils/catalogos/geografia';

const MUNICIPIOS: RegistroMunicipio[] = [
  { clave: '19039', descripcion: 'MONTERREY', claveEntidad: '19' },
  { clave: '19019', descripcion: 'SAN PEDRO GARZA GARCIA', claveEntidad: '19' },
  { clave: '14039', descripcion: 'GUADALAJARA', claveEntidad: '14' },
];

const LOCALIDADES: RegistroLocalidad[] = [
  { clave: '02340009', descripcion: 'MONTERREY, NL', estado: 'NUEVO LEON' },
  { clave: '02340010', descripcion: 'MONTERREY (SAN BERNABE), NL', estado: 'NUEVO LEON' },
  { clave: '02301003', descripcion: 'ABASOLO, NL', estado: 'NUEVO LEON' },
  { clave: '01539009', descripcion: 'GUADALAJARA, JAL', estado: 'JALISCO' },
  { clave: '00502003', descripcion: 'ACUÑA, COAH', estado: 'COAHUILA' },
  { clave: '00201001', descripcion: 'TIJUANA, BC', estado: 'BAJA CALIFORNIA' },
  { clave: '00301001', descripcion: 'LA PAZ, BCS', estado: 'BAJA CALIFORNIA SUR' },
  { clave: '01500001', descripcion: 'TOLUCA, MEX', estado: 'EDO DE MEXICO' },
  { clave: '10100005', descripcion: 'CANADA (NO IDENTIFICADOS)', estado: null },
  { clave: '10100006', descripcion: 'OTTAWA, ON', estado: 'CANADA' },
];

describe('geografia', () => {
  it('finds an entidad key by its name, ignoring accents and case', () => {
    expect(claveDeEntidad('Nuevo León')).toBe('19');
    expect(claveDeEntidad('nuevo leon')).toBe('19');
    expect(claveDeEntidad('Narnia')).toBeNull();
  });

  it('lists the municipios of an entidad in title case', () => {
    expect(municipiosDeEntidad(MUNICIPIOS, 'Nuevo León').map((m) => m.etiqueta)).toEqual([
      'Monterrey',
      'San Pedro Garza Garcia',
    ]);
    expect(municipiosDeEntidad(MUNICIPIOS, 'Narnia')).toEqual([]);
  });

  it('lists the localidades of an entidad, matching the catalog state to the entidad name', () => {
    expect(
      localidadesDeEntidad(LOCALIDADES, 'Coahuila de Zaragoza', null).map((l) => l.clave),
    ).toEqual(['00502003']);
    expect(localidadesDeEntidad(LOCALIDADES, 'México', null).map((l) => l.clave)).toEqual([
      '01500001',
    ]);
    expect(localidadesDeEntidad(LOCALIDADES, 'Baja California', null).map((l) => l.clave)).toEqual([
      '00201001',
    ]);
  });

  it('leaves out foreign places and rows without a state', () => {
    const todas = ['Nuevo León', 'Jalisco', 'México'].flatMap((e) =>
      localidadesDeEntidad(LOCALIDADES, e, null),
    );
    expect(todas.some((l) => l.clave.startsWith('101'))).toBe(false);
  });

  it('narrows to the localidades named after the municipio', () => {
    const opciones = localidadesDeEntidad(LOCALIDADES, 'Nuevo León', 'Monterrey');
    expect(opciones.map((l) => l.clave).sort()).toEqual(['02340009', '02340010']);
    expect(opciones.find((l) => l.clave === '02340009')?.etiqueta).toBe('MONTERREY, NL (02340009)');
  });

  it('offers the whole entidad when no localidad carries the municipio name', () => {
    expect(
      localidadesDeEntidad(LOCALIDADES, 'Nuevo León', 'San Pedro Garza Garcia')
        .map((l) => l.clave)
        .sort(),
    ).toEqual(['02301003', '02340009', '02340010']);
  });

  it('looks a description up by key', () => {
    expect(descripcionDeLocalidad(LOCALIDADES, '01539009')).toBe('GUADALAJARA, JAL');
    expect(descripcionDeLocalidad(LOCALIDADES, '99999999')).toBe('');
  });
});

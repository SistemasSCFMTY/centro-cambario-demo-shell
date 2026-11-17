import {
  consultaDeEstado,
  consultaDeParametros,
  paginar,
  parametrosDeConsulta,
} from '@utils/lista/consulta-lista';

describe('consulta de lista', () => {
  it('turns a state into a request and back into params', () => {
    const consulta = consultaDeEstado({
      pagina: 2,
      tamano: 10,
      orden: { columna: 'monto', direccion: 'desc' },
      filtros: { tipo: 'COMPRA' },
    });
    const parametros = parametrosDeConsulta(consulta);
    expect(parametros).toEqual({
      pagina: '2',
      limite: '10',
      orden: 'monto',
      direccion: 'desc',
      tipo: 'COMPRA',
    });
    expect(consultaDeParametros(parametros)).toEqual(consulta);
  });

  it('defaults a missing or broken request', () => {
    expect(consultaDeParametros({ pagina: 'x', limite: '0', direccion: 'sideways' })).toEqual({
      pagina: 1,
      limite: 25,
      orden: null,
      direccion: null,
      filtros: {},
    });
  });

  it('caps the page size', () => {
    expect(consultaDeParametros({ limite: '100000' }).limite).toBe(200);
  });
});

describe('paginar', () => {
  const filas = [
    { id: 'a', monto: 30, nombre: 'Zeta' },
    { id: 'b', monto: 10, nombre: 'Álvaro' },
    { id: 'c', monto: 20, nombre: null },
    { id: 'd', monto: 40, nombre: 'Beto' },
  ];
  const ordenadores = {
    monto: (f: (typeof filas)[number]) => f.monto,
    nombre: (f: (typeof filas)[number]) => f.nombre,
  };
  const consulta = (extra: object) => ({
    pagina: 1,
    limite: 2,
    orden: null,
    direccion: null,
    filtros: {},
    ...extra,
  });

  it('slices the requested page and reports the total', () => {
    const pagina = paginar(filas, consulta({ pagina: 2 }), ordenadores);
    expect(pagina.filas.map((f) => f.id)).toEqual(['c', 'd']);
    expect(pagina.total).toBe(4);
  });

  it('sorts numbers both ways', () => {
    const asc = paginar(filas, consulta({ orden: 'monto', direccion: 'asc' }), ordenadores);
    expect(asc.filas.map((f) => f.id)).toEqual(['b', 'c']);
    const desc = paginar(filas, consulta({ orden: 'monto', direccion: 'desc' }), ordenadores);
    expect(desc.filas.map((f) => f.id)).toEqual(['d', 'a']);
  });

  it('sorts text with Spanish collation and nulls last', () => {
    const asc = paginar(
      filas,
      consulta({ orden: 'nombre', direccion: 'asc', limite: 4 }),
      ordenadores,
    );
    expect(asc.filas.map((f) => f.id)).toEqual(['b', 'd', 'a', 'c']);
  });

  it('keeps the incoming order for an unknown column', () => {
    const pagina = paginar(filas, consulta({ orden: 'otro', direccion: 'asc' }), ordenadores);
    expect(pagina.filas.map((f) => f.id)).toEqual(['a', 'b']);
  });
});

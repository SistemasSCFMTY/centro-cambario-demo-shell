import { EsquemaLista } from '@data/interfaces/esquema-lista';
import {
  contarFiltrosActivos,
  leerEstadoLista,
  paginaMaxima,
  parametrosDeEstado,
} from '@utils/lista/estado-lista';

const ESQUEMA: EsquemaLista = {
  tamanos: [10, 25, 50],
  tamanoInicial: 25,
  ordenables: ['fecha', 'monto'],
  ordenInicial: { columna: 'fecha', direccion: 'desc' },
  filtros: [
    {
      id: 'tipo',
      etiqueta: 'Tipo',
      tipo: 'seleccion',
      opciones: [
        { valor: 'COMPRA', etiqueta: 'Compra' },
        { valor: 'VENTA', etiqueta: 'Venta' },
      ],
    },
    { id: 'folio', etiqueta: 'Folio', tipo: 'texto' },
    { id: 'desde', etiqueta: 'Desde', tipo: 'fecha' },
    { id: 'minimo', etiqueta: 'Mínimo', tipo: 'numero' },
    { id: 'vista', etiqueta: 'Vista', tipo: 'seleccion', soloUrl: true },
  ],
};

const lector = (params: Record<string, string>) => ({ get: (n: string) => params[n] ?? null });

describe('leerEstadoLista', () => {
  it('falls back to the schema defaults on an empty URL', () => {
    expect(leerEstadoLista(lector({}), ESQUEMA)).toEqual({
      pagina: 1,
      tamano: 25,
      orden: { columna: 'fecha', direccion: 'desc' },
      filtros: {},
    });
  });

  it('reads a valid state', () => {
    const estado = leerEstadoLista(
      lector({
        pagina: '3',
        limite: '10',
        orden: 'monto',
        direccion: 'asc',
        tipo: 'VENTA',
        folio: ' OP-1 ',
        desde: '2026-11-01',
        minimo: '1500.5',
      }),
      ESQUEMA,
    );
    expect(estado).toEqual({
      pagina: 3,
      tamano: 10,
      orden: { columna: 'monto', direccion: 'asc' },
      filtros: { tipo: 'VENTA', folio: 'OP-1', desde: '2026-11-01', minimo: '1500.5' },
    });
  });

  it('drops garbage', () => {
    const estado = leerEstadoLista(
      lector({
        pagina: '-4',
        limite: '999',
        orden: 'secreto',
        direccion: 'asc',
        tipo: 'DONACION',
        desde: '2026-13-45',
        minimo: 'mucho',
      }),
      ESQUEMA,
    );
    expect(estado.pagina).toBe(1);
    expect(estado.tamano).toBe(25);
    expect(estado.orden).toEqual({ columna: 'fecha', direccion: 'desc' });
    expect(estado.filtros).toEqual({});
  });

  it('caps text filters', () => {
    const estado = leerEstadoLista(lector({ folio: 'x'.repeat(500) }), ESQUEMA);
    expect(estado.filtros['folio']).toHaveLength(100);
  });
});

describe('parametrosDeEstado', () => {
  it('leaves the default state with no params', () => {
    const estado = leerEstadoLista(lector({}), ESQUEMA);
    expect(parametrosDeEstado(estado, ESQUEMA)).toEqual({});
  });

  it('writes what differs from the defaults', () => {
    const estado = {
      pagina: 2,
      tamano: 50,
      orden: { columna: 'monto', direccion: 'asc' as const },
      filtros: { tipo: 'COMPRA' },
    };
    expect(parametrosDeEstado(estado, ESQUEMA)).toEqual({
      tipo: 'COMPRA',
      pagina: '2',
      limite: '50',
      orden: 'monto',
      direccion: 'asc',
    });
  });
});

describe('contarFiltrosActivos', () => {
  it('counts the popover filters and skips URL-only ones', () => {
    const estado = leerEstadoLista(lector({ tipo: 'COMPRA', folio: 'A', vista: 'hoy' }), ESQUEMA);
    expect(contarFiltrosActivos(estado, ESQUEMA)).toBe(2);
  });
});

describe('paginaMaxima', () => {
  it('rounds up and never goes below 1', () => {
    expect(paginaMaxima(0, 25)).toBe(1);
    expect(paginaMaxima(25, 25)).toBe(1);
    expect(paginaMaxima(26, 25)).toBe(2);
  });
});

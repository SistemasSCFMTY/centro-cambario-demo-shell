import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ListaUrl } from '@components/lista-url/lista-url';
import { EsquemaLista } from '@data/interfaces/esquema-lista';

const ESQUEMA: EsquemaLista = {
  tamanos: [10, 25],
  tamanoInicial: 25,
  ordenables: ['fecha'],
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
    {
      id: 'vista',
      etiqueta: 'Vista',
      tipo: 'seleccion',
      soloUrl: true,
      opciones: [{ valor: 'hoy', etiqueta: 'Hoy' }],
    },
  ],
};

describe('ListaUrl', () => {
  let lista: ListaUrl;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    router = TestBed.inject(Router);
    lista = TestBed.runInInjectionContext(() => new ListaUrl());
    lista.iniciar(ESQUEMA);
  });

  it('reads the URL through the schema', async () => {
    await router.navigateByUrl('/?tipo=VENTA&limite=10&pagina=4&basura=1');
    expect(lista.estado()).toEqual({
      pagina: 4,
      tamano: 10,
      orden: { columna: 'fecha', direccion: 'desc' },
      filtros: { tipo: 'VENTA' },
    });
    expect(lista.filtrosActivos()).toBe(1);
  });

  it('writes filters to the URL, resets the page and keeps view switches', async () => {
    await router.navigateByUrl('/?vista=hoy&pagina=3');
    await lista.aplicarFiltros({ tipo: 'COMPRA', nada: 'x' });
    expect(router.url).toBe('/?vista=hoy&tipo=COMPRA');
    expect(lista.estado().pagina).toBe(1);
  });

  it('drops a filter when its value is empty and clears only the popover ones', async () => {
    await router.navigateByUrl('/?vista=hoy&tipo=VENTA');
    await lista.aplicarFiltros({ tipo: '' });
    expect(router.url).toBe('/?vista=hoy');
    await router.navigateByUrl('/?vista=hoy&tipo=VENTA');
    await lista.limpiarFiltros();
    expect(router.url).toBe('/?vista=hoy');
  });

  it('pages, sorts and resizes through the URL', async () => {
    await lista.irAPagina(2);
    expect(router.url).toBe('/?pagina=2');
    await lista.cambiarTamano(10);
    expect(router.url).toBe('/?limite=10');
    await lista.ordenar({ columna: 'fecha', direccion: 'asc' });
    expect(router.url).toBe('/?limite=10&orden=fecha&direccion=asc');
    await lista.ordenar(null);
    expect(router.url).toBe('/?limite=10');
  });

  it('steps back when the page is past the last one', async () => {
    await router.navigateByUrl('/?pagina=9');
    await lista.ajustarPagina(30);
    expect(router.url).toBe('/?pagina=2');
    await lista.ajustarPagina(30);
    expect(router.url).toBe('/?pagina=2');
  });
});

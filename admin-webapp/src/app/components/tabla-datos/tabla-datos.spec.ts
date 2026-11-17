import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CeldaTabla } from '@components/tabla-datos/celda-tabla';
import { TablaDatos } from '@components/tabla-datos/tabla-datos';
import { OrdenLista } from '@data/interfaces/orden-lista';
import { ColumnaTabla } from '@data/types/tabla.types';

interface Fila {
  folio: string;
  monto: number;
}

@Component({
  imports: [TablaDatos, CeldaTabla],
  template: `
    <app-tabla-datos
      titulo="Prueba"
      [columnas]="columnas"
      [filas]="filas()"
      [filaClicable]="clicable()"
      [total]="total()"
      [cargando]="cargando()"
      [pagina]="pagina()"
      [tamano]="10"
      [orden]="orden()"
      [ordenInicial]="ordenInicial()"
      [ordenables]="['folio', 'monto']"
      (paginaCambia)="pagina.set($event)"
      (ordenCambia)="orden.set($event)"
      (filaClic)="clic.set($event)"
    >
      <ng-template appCeldaTabla="folio" [filas]="filas()" let-fila>
        <strong class="folio">{{ fila.folio }}</strong>
      </ng-template>
    </app-tabla-datos>
  `,
})
class Anfitrion {
  readonly columnas: ColumnaTabla<Fila>[] = [
    { accessorKey: 'folio', header: 'Folio', meta: { numerica: false } },
    { accessorKey: 'monto', header: 'Monto', meta: { numerica: true, encabezadoOculto: true } },
  ];
  readonly filas = signal<Fila[]>([
    { folio: 'OP-1', monto: 100 },
    { folio: 'OP-2', monto: 250 },
  ]);
  readonly total = signal(35);
  readonly clicable = signal(true);
  readonly cargando = signal(false);
  readonly pagina = signal(1);
  readonly orden = signal<OrdenLista | null>(null);
  readonly ordenInicial = signal<OrdenLista | null>(null);
  readonly clic = signal<Fila | null>(null);
}

describe('TablaDatos', () => {
  const crear = () => {
    const fixture = TestBed.createComponent(Anfitrion);
    fixture.detectChanges();
    const raiz = fixture.nativeElement as HTMLElement;
    return { fixture, raiz, anfitrion: fixture.componentInstance };
  };

  it('draws the page rows, with custom cells and numeric columns', () => {
    const { raiz } = crear();
    const filas = raiz.querySelectorAll('tbody tr');
    expect(filas).toHaveLength(2);
    expect(raiz.querySelector('.folio')?.textContent).toBe('OP-1');
    const monto = filas[0].querySelectorAll('td')[1];
    expect(monto.textContent?.trim()).toBe('100');
    expect(monto.classList.contains('font-data')).toBe(true);
  });

  it('shows the range and the page buttons from the server total', () => {
    const { raiz } = crear();
    expect(raiz.querySelector('nav p')?.textContent?.trim()).toBe('1–10 de 35');
    expect(raiz.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('1');
    expect(raiz.querySelector('[aria-label="Página 4"]')).not.toBeNull();
  });

  it('asks for sorting asc, then desc, then none', () => {
    const { fixture, raiz, anfitrion } = crear();
    const boton = () => raiz.querySelector('thead button') as HTMLButtonElement;
    boton().click();
    fixture.detectChanges();
    expect(anfitrion.orden()).toEqual({ columna: 'folio', direccion: 'asc' });
    boton().click();
    fixture.detectChanges();
    expect(anfitrion.orden()).toEqual({ columna: 'folio', direccion: 'desc' });
    boton().click();
    fixture.detectChanges();
    expect(anfitrion.orden()).toBeNull();
  });

  it('flips the default column instead of dropping its sort', () => {
    const { fixture, raiz, anfitrion } = crear();
    anfitrion.ordenInicial.set({ columna: 'folio', direccion: 'desc' });
    anfitrion.orden.set({ columna: 'folio', direccion: 'desc' });
    fixture.detectChanges();
    const boton = () => raiz.querySelector('thead button') as HTMLButtonElement;
    boton().click();
    fixture.detectChanges();
    expect(anfitrion.orden()).toEqual({ columna: 'folio', direccion: 'asc' });
    boton().click();
    fixture.detectChanges();
    expect(anfitrion.orden()).toEqual({ columna: 'folio', direccion: 'desc' });
  });

  it('aligns numeric headers to the end', () => {
    const { raiz } = crear();
    const th = raiz.querySelectorAll('thead th')[1];
    expect(th.classList.contains('text-end')).toBe(true);
    expect(th.classList.contains('text-start')).toBe(false);
  });

  it('draws no sort button for columns the API cannot sort', () => {
    const { raiz } = crear();
    expect(raiz.querySelectorAll('thead button').length).toBe(1);
  });

  it('keeps a hidden header for screen readers only', () => {
    const { raiz } = crear();
    const th = raiz.querySelectorAll('thead th')[1];
    expect(th.querySelector('.sr-only')?.textContent?.trim()).toBe('Monto');
    expect(th.querySelector('button')).toBeNull();
  });

  it('tints rows on hover only when the row opens something', () => {
    const { fixture, raiz, anfitrion } = crear();
    const fila = () => raiz.querySelector('tbody tr') as HTMLElement;
    expect(fila().className).toContain('hover:bg-primary-50');
    expect(fila().className).toContain('cursor-pointer');
    anfitrion.clicable.set(false);
    fixture.detectChanges();
    expect(fila().className).not.toContain('hover:bg-primary-50');
    expect(fila().className).not.toContain('cursor-pointer');
    fila().click();
    expect(anfitrion.clic()).toBeNull();
  });

  it('opens the row from a click and from its row action', () => {
    const { fixture, raiz, anfitrion } = crear();
    (raiz.querySelectorAll('tbody tr')[1] as HTMLElement).click();
    expect(anfitrion.clic()?.folio).toBe('OP-2');
    anfitrion.clic.set(null);
    (raiz.querySelector('.row-action') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(anfitrion.clic()?.folio).toBe('OP-1');
  });

  it('changes page from the paginator', () => {
    const { fixture, raiz, anfitrion } = crear();
    (raiz.querySelector('[aria-label="Página siguiente"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(anfitrion.pagina()).toBe(2);
  });

  it('shows skeleton rows on first load and the flat empty state when empty', () => {
    const { fixture, raiz, anfitrion } = crear();
    anfitrion.filas.set([]);
    anfitrion.cargando.set(true);
    fixture.detectChanges();
    expect(raiz.querySelectorAll('tbody tr')).toHaveLength(8);
    expect(raiz.querySelector('.skeleton')).not.toBeNull();

    anfitrion.cargando.set(false);
    anfitrion.total.set(0);
    fixture.detectChanges();
    expect(raiz.querySelector('tbody')?.textContent).toContain('No hay registros');
  });

  it('keeps the rows while refreshing and sweeps the top edge', () => {
    const { fixture, raiz, anfitrion } = crear();
    anfitrion.cargando.set(true);
    fixture.detectChanges();
    expect(raiz.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(raiz.querySelector('.barra-refresco')).not.toBeNull();
    expect(raiz.querySelector('.skeleton')).toBeNull();
  });
});

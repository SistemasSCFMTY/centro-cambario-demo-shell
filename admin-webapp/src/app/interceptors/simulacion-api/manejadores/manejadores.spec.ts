import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ClienteDetalleDto } from '@data/dto/clientes.dto';
import { PaginaDto } from '@data/dto/lista.dto';
import { OperacionDetalleDto, OperacionListaDto } from '@data/dto/operaciones.dto';
import { CLIENTES } from '@data/fixtures/clientes.fixture';
import { OPERACIONES } from '@data/fixtures/operaciones.fixture';
import { simulacionApiInterceptor } from '@interceptors/simulacion-api/simulacion-api.interceptor';
import { ClientesService } from '@services/clientes/clientes.service';
import { NegocioService } from '@services/negocio/negocio.service';
import { CatalogosService } from '@services/catalogos/catalogos.service';
import { OperacionesService } from '@services/operaciones/operaciones.service';
import { firstValueFrom } from 'rxjs';

const consulta = (extra: object = {}) => ({
  pagina: 1,
  limite: 10,
  orden: null,
  direccion: null,
  filtros: {},
  ...extra,
});

describe('simulated module handlers', () => {
  let operaciones: OperacionesService;
  let clientes: ClientesService;
  let catalogos: CatalogosService;
  let negocio: NegocioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([simulacionApiInterceptor]))],
    });
    operaciones = TestBed.inject(OperacionesService);
    clientes = TestBed.inject(ClientesService);
    catalogos = TestBed.inject(CatalogosService);
    negocio = TestBed.inject(NegocioService);
  });

  it('answers operaciones like a paged server, newest first by default', async () => {
    const pagina: PaginaDto<OperacionListaDto> = await firstValueFrom(
      operaciones.listar(consulta({ limite: 10 })),
    );
    expect(pagina.total).toBe(OPERACIONES.length);
    expect(pagina.filas).toHaveLength(10);
    const fechas = pagina.filas.map((o) => o.fechaOperacion);
    expect(fechas).toEqual([...fechas].sort().reverse());
    expect(pagina.filas[0].sucursal).not.toBe('');
  });

  it('filters and sorts operaciones on the server side', async () => {
    const pendientes = await firstValueFrom(
      operaciones.listar(consulta({ filtros: { vista: 'pendientes' } })),
    );
    expect(pendientes.filas.every((o) => o.estatus === 'PENDIENTE_AUTORIZACION')).toBe(true);

    const porMonto = await firstValueFrom(
      operaciones.listar(
        consulta({ orden: 'montoUsd', direccion: 'desc', filtros: { tipo: 'COMPRA' } }),
      ),
    );
    expect(porMonto.filas.every((o) => o.tipo === 'COMPRA')).toBe(true);
    const montos = porMonto.filas.map((o) => o.montoUsd);
    expect(montos).toEqual([...montos].sort((a, b) => b - a));
  });

  it('answers a second page and the operation detail with its audit trail', async () => {
    const segunda = await firstValueFrom(operaciones.listar(consulta({ pagina: 2, limite: 10 })));
    expect(segunda.pagina).toBe(2);
    const detalle: OperacionDetalleDto = await firstValueFrom(
      operaciones.obtener(OPERACIONES[0].id),
    );
    expect(detalle.operacion.id).toBe(OPERACIONES[0].id);
    expect(detalle.auditoria.length).toBeGreaterThan(0);
  });

  it('refuses an unknown operation with a 404', async () => {
    await expect(firstValueFrom(operaciones.obtener('op-9999'))).rejects.toMatchObject({
      status: 404,
    });
  });

  it('searches clientes without accents and returns the detail', async () => {
    const pagina = await firstValueFrom(
      clientes.listar(consulta({ filtros: { busqueda: 'hernandez' } })),
    );
    expect(pagina.filas.map((c) => c.nombreCompleto)).toEqual(['Sofía Hernández Cantú']);
    const detalle: ClienteDetalleDto = await firstValueFrom(clientes.obtener(CLIENTES[0].id));
    expect(detalle.cliente.documentos.length).toBeGreaterThan(0);
  });

  it('serves the catalogs', async () => {
    expect(await firstValueFrom(catalogos.divisas())).toHaveLength(6);
    expect(await firstValueFrom(catalogos.sucursales())).toHaveLength(3);
    expect((await firstValueFrom(catalogos.cajeros())).length).toBeGreaterThan(0);
  });

  it('serves the municipios and localidades of an entidad from the lazy CNBV catalogs', async () => {
    const municipios = await firstValueFrom(catalogos.municipios('Nuevo León'));
    expect(municipios.map((m) => m.etiqueta)).toContain('Monterrey');
    expect(municipios.every((m) => m.clave === m.etiqueta)).toBe(true);
    expect(await firstValueFrom(catalogos.municipios(''))).toEqual([]);

    const localidades = await firstValueFrom(catalogos.localidades('Nuevo León', 'Monterrey'));
    expect(localidades.some((l) => l.clave === '02340009')).toBe(true);
    const todas = await firstValueFrom(catalogos.localidades('Nuevo León', ''));
    expect(todas.length).toBeGreaterThan(localidades.length);
  });

  it('shows an alta of sucursal in the catalog without a reload, with its localidad described', async () => {
    const creada = await firstValueFrom(
      negocio.crearSucursal({
        clave: 'qro-centro',
        nombre: 'Querétaro Centro',
        responsableId: 'cajero-04',
        calle: 'Avenida Corregidora',
        numeroExterior: '10',
        numeroInterior: '',
        colonia: 'Centro',
        codigoPostal: '76000',
        entidad: 'Querétaro',
        municipio: 'Querétaro',
        localidad: '03303009',
        telefono: '',
        horario: '',
      }),
    );
    expect(creada.clave).toBe('QRO-CENTRO');
    expect(creada.numeroInterior).toBeNull();
    expect(creada.responsableId).toBe('cajero-04');
    expect(creada.localidadDescripcion).toBe('AMEALCO DE BONFIL, QRO');

    const sucursales = await firstValueFrom(catalogos.sucursales());
    expect(sucursales.map((s) => s.clave)).toContain('QRO-CENTRO');

    const baja = await firstValueFrom(negocio.cambiarEstatusSucursal(creada.id, false));
    expect(baja.estatus).toBe('BAJA');
    const despues = await firstValueFrom(catalogos.sucursales());
    expect(despues.find((s) => s.id === creada.id)?.estatus).toBe('BAJA');
  });
});

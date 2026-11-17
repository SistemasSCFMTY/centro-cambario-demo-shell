import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import { EncabezadoPagina } from '@components/encabezado-pagina/encabezado-pagina';
import { CeldaPrincipal } from '@components/celda-principal/celda-principal';
import { FiltrosPopover } from '@components/filtros-popover/filtros-popover';
import { ListaUrl } from '@components/lista-url/lista-url';
import { PillEstatus } from '@components/pill-estatus/pill-estatus';
import { CeldaTabla } from '@components/tabla-datos/celda-tabla';
import { TablaDatos } from '@components/tabla-datos/tabla-datos';
import { ESQUEMA_LISTA_CLIENTES, PILL_NIVEL_EXPEDIENTE } from '@data/constants/clientes.constants';
import { ETIQUETA_TIPO_PERSONA } from '@data/constants/dominio.constants';
import { PILL_ESTATUS_CLIENTE, PILL_PEP } from '@data/constants/estatus.constants';
import { ClienteResumen } from '@data/interfaces/cliente-resumen';
import { ColumnaTabla } from '@data/types/tabla.types';
import { Store } from '@ngxs/store';
import { FechaPipe } from '@pipes/fecha.pipe';
import { CargarClientes } from '@store/clientes/actions/clientes.actions';
import { ClientesState } from '@store/clientes/state/clientes.state';
import { consultaDeEstado } from '@utils/lista/consulta-lista';

/** `/clientes`: the cliente list, read-only this ola. Filters, page and sort live in the URL. */
@Component({
  selector: 'app-clientes-lista',
  imports: [
    CeldaPrincipal,
    CeldaTabla,
    EncabezadoPagina,
    FechaPipe,
    FiltrosPopover,
    PillEstatus,
    TablaDatos,
  ],
  providers: [ListaUrl],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './clientes-lista.html',
})
export class ClientesLista {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  protected readonly lista = inject(ListaUrl);

  protected readonly pagina = this.store.selectSignal(ClientesState.pagina);
  protected readonly cargando = this.store.selectSignal(ClientesState.cargando);
  protected readonly error = this.store.selectSignal(ClientesState.error);

  protected readonly filas = computed(() => this.pagina()?.filas ?? []);
  protected readonly hayFiltros = computed(() => this.lista.filtrosActivos() > 0);

  protected readonly esquema = ESQUEMA_LISTA_CLIENTES;
  protected readonly pillEstatus = PILL_ESTATUS_CLIENTE;
  protected readonly pillNivel = PILL_NIVEL_EXPEDIENTE;
  protected readonly pillPep = PILL_PEP;
  protected readonly etiquetaPersona = ETIQUETA_TIPO_PERSONA;
  protected readonly columnas: ColumnaTabla<ClienteResumen>[] = [
    { accessorKey: 'nombreCompleto', header: 'Cliente' },
    { accessorKey: 'numeroCliente', header: 'Número' },
    { accessorKey: 'fechaBase', header: 'Nacimiento o constitución' },
    { id: 'identificador', accessorFn: (c) => c.curp ?? c.rfc, header: 'CURP o RFC' },
    { accessorKey: 'nivelExpediente', header: 'Expediente' },
    { accessorKey: 'estatus', header: 'Estatus' },
    { accessorKey: 'fechaAlta', header: 'Alta' },
  ];

  constructor() {
    this.lista.iniciar(ESQUEMA_LISTA_CLIENTES);
    effect(() => {
      const consulta = consultaDeEstado(this.lista.estado());
      untracked(() => this.store.dispatch(new CargarClientes(consulta)));
    });
    effect(() => {
      const pagina = this.pagina();
      if (pagina) untracked(() => this.lista.ajustarPagina(pagina.total));
    });
  }

  protected abrir(cliente: ClienteResumen): void {
    this.router.navigate(['/clientes', cliente.id]);
  }
}

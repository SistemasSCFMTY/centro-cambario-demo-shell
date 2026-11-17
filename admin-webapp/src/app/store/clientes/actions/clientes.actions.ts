import { ConsultaListaDto } from '@data/dto/lista.dto';

export class CargarClientes {
  static readonly type = '[Clientes] Cargar lista';
  constructor(readonly consulta: ConsultaListaDto) {}
}

export class CargarCliente {
  static readonly type = '[Clientes] Cargar detalle';
  constructor(readonly id: string) {}
}

export class CargarClienteOperaciones {
  static readonly type = '[Clientes] Cargar operaciones del cliente';
  constructor(readonly id: string) {}
}

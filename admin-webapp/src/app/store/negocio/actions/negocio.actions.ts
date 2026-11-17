import { ConsultaListaDto } from '@data/dto/lista.dto';
import { GuardarNegocioDto } from '@data/dto/negocio-guardar.dto';
import { DatosSucursal } from '@data/interfaces/datos-sucursal-negocio';

export class CargarNegocio {
  static readonly type = '[Negocio] Cargar';
}

export class CargarOpcionesNegocio {
  static readonly type = '[Negocio] Cargar opciones';
}

/** The municipios of an entidad (empty entidad: none). Called when the form's entidad changes. */
export class CargarMunicipiosNegocio {
  static readonly type = '[Negocio] Cargar municipios';
  constructor(readonly entidad: string) {}
}

/** The localidades of an entidad, narrowed to a municipio (an empty municipio yields no localidades). */
export class CargarLocalidadesNegocio {
  static readonly type = '[Negocio] Cargar localidades';
  constructor(
    readonly entidad: string,
    readonly municipio: string,
  ) {}
}

export class CargarAuditoriaNegocio {
  static readonly type = '[Negocio] Cargar auditoría';
}

export class CargarSucursales {
  static readonly type = '[Negocio] Cargar sucursales';
  constructor(readonly consulta: ConsultaListaDto) {}
}

export class CargarSucursal {
  static readonly type = '[Negocio] Cargar sucursal';
  constructor(readonly id: string) {}
}

export class GuardarNegocio {
  static readonly type = '[Negocio] Guardar';
  constructor(readonly datos: GuardarNegocioDto) {}
}

/** Alta (`id` null) or corrección of a sucursal. */
export class GuardarSucursal {
  static readonly type = '[Negocio] Guardar sucursal';
  constructor(
    readonly datos: DatosSucursal,
    readonly id: string | null,
  ) {}
}

/** Dar de baja (`activa` false) or reactivar a sucursal. */
export class CambiarEstatusSucursal {
  static readonly type = '[Negocio] Cambiar estatus de sucursal';
  constructor(
    readonly id: string,
    readonly activa: boolean,
  ) {}
}

export class LimpiarErrorGuardadoNegocio {
  static readonly type = '[Negocio] Limpiar error de guardado';
}

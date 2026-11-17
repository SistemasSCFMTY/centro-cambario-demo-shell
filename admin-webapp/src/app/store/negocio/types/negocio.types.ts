import { PaginaDto } from '@data/dto/lista.dto';
import { PerfilNegocioDto } from '@data/dto/negocio-perfil.dto';
import { OpcionCatalogo } from '@data/interfaces/opcion-catalogo';
import { OpcionesNegocio } from '@data/interfaces/opciones-negocio';
import { RegistroAuditoria } from '@data/interfaces/registro-auditoria';
import { SucursalResumen } from '@data/interfaces/sucursal-resumen-negocio';

export interface NegocioStateModel {
  perfil: PerfilNegocioDto | null;
  /** The lists the forms choose from. */
  opciones: OpcionesNegocio | null;
  /** Municipios of the entidad picked in the form on screen. */
  municipios: OpcionCatalogo[];
  /** Localidades of the municipio picked in the form on screen. */
  localidades: OpcionCatalogo[];
  /** The audit trail of the negocio and its sucursales. */
  auditoria: RegistroAuditoria[];
  sucursales: PaginaDto<SucursalResumen> | null;
  /** The sucursal being edited. */
  sucursal: SucursalResumen | null;
  cargando: boolean;
  cargandoAuditoria: boolean;
  cargandoSucursales: boolean;
  cargandoSucursal: boolean;
  /** A municipios or localidades list is on its way. */
  cargandoGeografia: boolean;
  guardando: boolean;
  /** A failed load, per list. */
  errorPerfil: string | null;
  errorOpciones: string | null;
  errorGeografia: string | null;
  errorSucursales: string | null;
  errorAuditoria: string | null;
  errorSucursal: string | null;
  /** The reason a save was refused, to show on the form. */
  errorGuardado: string | null;
}

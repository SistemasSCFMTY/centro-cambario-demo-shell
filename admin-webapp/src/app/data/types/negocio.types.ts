import { FormControl } from '@angular/forms';

/** The tabs of the negocio page, in order (Auditoría is always last). */
export type PestanaNegocio = 'general' | 'legal' | 'sucursales' | 'auditoria';

/** Which records the negocio audit trail shows. */
export type FiltroAuditoriaNegocio = 'todos' | 'negocio' | 'sucursal';

/** The legal documents the centro keeps on file (plans/04 Documentos legales). */
export type TipoDocumentoLegal =
  | 'ACTA_CONSTITUTIVA'
  | 'PODER_REPRESENTANTE'
  | 'CONSTANCIA_FISCAL'
  | 'CONSTANCIA_REGISTRO'
  | 'DICTAMEN_TECNICO'
  | 'MANUAL_PLD';

/** What the simulated backend answers when it refuses a negocio change. */
export type CodigoErrorNegocio =
  | 'SUCURSAL_NO_ENCONTRADA'
  | 'CLAVE_SUCURSAL_DUPLICADA'
  | 'SUCURSAL_CON_USUARIOS'
  | 'ULTIMA_SUCURSAL_ACTIVA'
  | 'MATRIZ_INACTIVA'
  | 'MATRIZ_NO_DE_BAJA';

/** How a field of a negocio form is drawn. `divisas` is a group of checkboxes. */
export type TipoCampoFormulario = 'texto' | 'fecha' | 'seleccion' | 'divisas';

/** The list a `seleccion` field draws its options from (`OpcionesNegocio`). */
export type FuenteOpcionesNegocio =
  'entidades' | 'municipios' | 'localidades' | 'sucursales' | 'usuarios' | 'responsables';

/** The part of the profile a field of the edit form is saved into. */
export type DestinoCampoNegocio = 'centro' | 'legal';

/** The control of a negocio form field: text, or the list of a `divisas` field. */
export type ControlNegocio = FormControl<string | string[]>;

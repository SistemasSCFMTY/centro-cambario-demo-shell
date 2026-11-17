import { CampoFormulario } from '@data/interfaces/campo-formulario-negocio';

/** A group of fields of a form page: title and one line on the left, the fields on the right. */
export interface SeccionFormulario {
  id: string;
  titulo: string;
  descripcion: string;
  campos: CampoFormulario[];
}

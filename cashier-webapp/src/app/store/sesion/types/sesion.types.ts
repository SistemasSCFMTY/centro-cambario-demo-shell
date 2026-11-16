import { SesionDto } from '@data/dto/autenticacion.dto';

export interface SesionStateModel {
  /** In memory only (plans/00: no persistence outside NGXS): a reload signs out. */
  sesion: SesionDto | null;
}

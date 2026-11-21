import { SesionDto } from '@data/dto/autenticacion.dto';

export interface SesionStateModel {
  /** Persisted in localStorage (`SESSION_STORAGE_KEY`), so a reload keeps the user signed in. */
  sesion: SesionDto | null;
}

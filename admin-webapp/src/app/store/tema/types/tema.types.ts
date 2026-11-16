import { MarcaDto } from '@data/dto/marca.dto';
import { ModoTema } from '@data/types/tema.types';

export interface TemaStateModel {
  /** Persisted (localStorage, key `tema.modo`). */
  modo: ModoTema;
  /** The OS preference, read at startup and followed while the app runs. */
  prefiereOscuro: boolean;
  marca: MarcaDto | null;
}

import { Sucursal } from '@data/interfaces/sucursal';

/** A sucursal as the list and the edit form see it: the record plus its counts. */
export interface SucursalResumen extends Sucursal {
  /** Staff assigned to it. */
  usuarios: number;
  /** Operations made in it. */
  operaciones: number;
}

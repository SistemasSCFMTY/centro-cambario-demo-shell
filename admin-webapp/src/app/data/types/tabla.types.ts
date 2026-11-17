import { ColumnDef, RowData } from '@tanstack/angular-table';
import { CARACTERISTICAS_TABLA } from '@utils/tabla/caracteristicas-tabla';

/** A column of the data table: TanStack's definition over our feature set. */
export type ColumnaTabla<T extends RowData> = ColumnDef<typeof CARACTERISTICAS_TABLA, T, any>;

/** Row height of a data table: `alta` for rows with an avatar or a two-line cell. */
export type AltoFila = 'compacta' | 'alta';

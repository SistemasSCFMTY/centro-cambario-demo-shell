import {
  metaHelper,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/angular-table';
import { MetaColumna } from '@data/interfaces/meta-columna';

/** The TanStack features the data table uses: sorting and paging state only, the server does the work. */
export const CARACTERISTICAS_TABLA = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnMeta: metaHelper<MetaColumna>(),
});

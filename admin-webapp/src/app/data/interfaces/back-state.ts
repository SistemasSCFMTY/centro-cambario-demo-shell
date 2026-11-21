import { Params } from '@angular/router';

/**
 * History state a list puts on the navigation to one of its rows: the list's path and query params,
 * so the detail's back link returns to the same view, filters, page and sort.
 */
export interface BackState {
  back: { path: string; params: Params };
}

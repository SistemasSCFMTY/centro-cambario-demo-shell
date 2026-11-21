import { Params } from '@angular/router';
import { BackState } from '@data/interfaces/back-state';

/** The list path of a URL: no query string, no fragment (`/operaciones?vista=hoy` → `/operaciones`). */
export function pathWithoutQuery(url: string): string {
  return url.split(/[?#]/)[0];
}

/** The history state that lets a detail page return to this list view. */
export function backState(url: string, params: Params): BackState {
  return { back: { path: pathWithoutQuery(url), params: { ...params } } };
}

/**
 * The back link's query params: the list's own when the history state came from the list the link
 * points to (`target`, a serialized path), else `fallback`. Anything else in the state is ignored.
 */
export function backLinkParams(
  state: unknown,
  target: string,
  fallback: Params | null,
): Params | null {
  const back = (state as Partial<BackState> | null)?.back;
  const valid =
    !!back && typeof back.path === 'string' && !!back.params && typeof back.params === 'object';
  return valid && pathWithoutQuery(target) === back.path ? back.params : fallback;
}

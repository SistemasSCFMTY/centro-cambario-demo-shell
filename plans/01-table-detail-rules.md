# 01 — Table + detail-view styling rules

> Copied from **manttio-whitelabeled/superadmin** on 2026-11-13. Sources:
> - `.claude/plans/superadmin/01-conventions.md` (§ Design language, § Table idioms, § Styling)
> - `superadmin/src/theme/table.scss`
> - `superadmin/src/styles.scss` (component layer)
> - the detail pages `equipment-view.html` and `customer-view.html`
>
> manttio is PrimeNG + Tailwind 3. The rules are kept as written and re-hosted on **our own CSS classes over Spartan**. The `p-datatable` selectors become our `.tabla*` classes. Items marked **OPEN** are the lead's decisions to make.
>
> **Revised 2026-11-16 by `05-reglas-onp.md`:** semantic tokens replace the manttio names, every page is one `panel` with sections split by hairlines, and empty states are flat. Sizes below are written as text styles: manttio's `text-xs` → `text-caption-1`, `text-sm` → `text-subheadline`, `text-base` → `text-body`, `text-lg` → `text-headline`, `text-2xl` → `text-large-title`; colors `surface-*` text/borders → `text-ink*` / `border-line*`.

## Shared building blocks (both tables and detail views use these)
| Class | Rule (as in manttio) |
|---|---|
| `panel` | (`05`) `rounded-2xl bg-panel` + panel shadow. **One per page**, wrapping all its content; sections inside split by `border-t border-line`. |
| `card` | (`05`) `rounded-xl border border-line bg-panel` + xs shadow. Only for content that stands on its own inside a panel. **The border separates and the shadow only lifts.** Nested grouping inside a card uses a background shift or an internal divider, **never a second bordered box**. |
| `micro-label` | `text-caption-1 font-bold text-ink-muted` (clears AA on the panel). Used for card, section and table headers and for `<dt>`. **Title/sentence case, never uppercase.** |
| `link-action` | `inline-flex gap-2 text-callout font-bold`, primary `700` (hover `900`; dark `300`/`200`). Used for entity links and "ver todos". |
| `.row-action` (+ `--danger`, `--success`) | `size-9` round icon-ghost button, neutral hover tint, `disabled:opacity-40`. The keyboard path when the whole row is clickable. |
| `.skeleton` | `h-3.5 max-w-36 rounded-full`, neutral bar with a pulse that goes static under `prefers-reduced-motion`. **Skeletons for content regions; spinners only inside buttons.** |
| Empty state | (`05`) **Flat:** a plain 28px icon (`strokeWidth` 1.5, `text-ink-subtle`), a headline, one sentence and at most one small action. No disc, card, border or background. |
| `callout` + `callout-info` / `callout-warn` / `callout-danger` | `rounded-lg border px-4 py-3 text-subheadline`. Info rides the primary tint; warn/danger use the fixed `warning-*` / `danger-*` scales (status colors are never branded). |
| `.lead-avatar` | `size-9 rounded-full`, `primary-100` fill + `primary-800` text (dark `primary-1000/60` + `primary-300`), initials. For **people and companies**. |
| `.lead-thumb` / `.lead-thumb-fallback` | `size-9 rounded-md` photo over a neutral placeholder; the fallback is the entity's own Lucide glyph on the same tile. For **things**. Never an empty grey square, never initials on a thing. |
| Status pills | `rounded-full` pills; colors from a fixed semantic set, unchanged across tenants and modes. |

## Tables

### Shape
- **Tabular/feed data is always a table** (`<table>` via our table primitive). **Never** hand-rolled `<ol>`/`<div>` row lists.
- **A list page's table sits flush in its panel section** (`05`): the section's hairline is its top edge and the table carries no radius, border or shadow of its own.
- **Inside a padded section or card,** wrap it in `.card-flush-table`: `-mx-8` (section) or `-mx-6` (card) cancels the gutters, and the table sheds its radius, border and shadow, because what's around it already draws them.
- The table container scrolls horizontally on its own (`overflow-x-auto`), with the right-edge fade (`05`, Horizontal overflow). Cells never wrap. The lead column is pinned left and the row actions pinned right (lead, 2026-11-20). **Never page-level horizontal scroll.**

### Density: "airy chrome, dense data"
- Header cells: `px-4 py-3 text-left micro-label whitespace-nowrap`, on the card's own fill.
- Body cells: `px-4 py-2.5 text-sm whitespace-nowrap`, strongest neutral text. 13–14px table text is desktop scope.
- Rows separate by **whitespace + hover**, with no zebra stripes and no row borders. The header separates by its surface tint.

### Row states
| State | Light | Dark |
|---|---|---|
| hover | `primary-0` | neutral `800` |
| active (pressed) / selected | `primary-100` | neutral `700` |
- `transition-colors duration-100`.
- **The whole row is clickable into the detail view.** Per-row actions still exist as `.row-action` buttons on the trailing edge (the keyboard path), in a column pinned at the right (lead, 2026-11-20).

### Sorting
- Sortable header: `cursor-pointer select-none`, neutral hover tint.
- Sort icon `size-3.5` in primary `600` (dark `400`). Multi-sort badge: a `size-4` round primary disc with a `text-primary-foreground` `text-caption-2` number.

### Numbers
- **Money** always carries its ISO 4217 code, never `$` or a bare number (`05` Money and dates, lead, 2026-11-20).
- **Every numeric column** gets `font-data` + `tabular-nums`. The stylesheet sets `tabular-nums` on any `th/td.font-data`, so a cell can't forget it.
- **Directional numeric idiom:** only for a value that truly has a direction (vs last period, movement). It renders in the fixed semantic set with a `size-3` arrow ahead of it: emerald up, red down. **Never brand-colored.** Prices, totals, counts and folios have no direction and stay neutral.

### Lead cell (row identity)
- **The first column is chosen by what the entity is:**
  - people and companies → `.lead-avatar` + name (canon: the customers list)
  - things → `.lead-thumb` or `.lead-thumb-fallback`
- **Column order** (lead, 2026-11-20): the lead column first, pinned (`05` Horizontal overflow), then the deciding column (Estatus), then the rest. Per-screen orders: `02` (Column order) and `04` (Sucursales).
- Lists whose rows carry a `size-9` lead or a two-line cell use the tall row height (see Paging).

### Loading, empty, refresh
- **First load:** no spinner overlay. The body shows **8 rows of `.skeleton` bars**.
- **Empty:** one row spanning all columns holding the flat empty state (`05`). No hover on it. With active filters it offers «Limpiar filtros» (built into the data table). Zero results are announced to screen readers through a live region that stays mounted (lead, 2026-11-20).
- **Error:** the page's `app-error-notice` (`05`) replaces the empty state; the table shows none while it shows (lead, 2026-11-20).
- **Page change / refresh:** keep the current rows at full brightness, **no opacity dip**, and swap the text when data lands. While a request is slow:
  - the body gets `pointer-events-none`
  - after a `400ms` delay, a `h-0.5` primary hairline sweeps the card's top edge (40% width, 1.1s linear, infinite)
  - under reduced motion the bar sits static at the top-left
  - the refreshing state and skeletons are mutually exclusive

### Paging
- **The paged table keeps a full page's height** so the paginator never jumps. It's a floor (`min-height`), not a fixed height:
  - `min-height = page-rows × row-h + header-h`
  - row-h is `2.5rem` (one line of `text-sm`), or `3.5rem` for tall lists with an avatar or two-line cells
  - header-h is `2.75rem`
  - page-rows is bound from the list's page size
- **Paginator:** `flex justify-end gap-1.5 px-4 py-3` on the card fill.
  - Page buttons: `size-9 rounded-md text-subheadline font-bold font-data tabular-nums`, neutral text, `primary-0` hover.
  - **Selected page = solid `primary-700` + white** (hover `800`; dark `600`/`500`), **no weight bump**.
  - Disabled: `opacity-30 cursor-not-allowed`.
  - Rows-per-page select: Spartan's `hlm-select`, small trigger (`size="sm"`), `text-subheadline`.
- Empty caption/footer slots collapse. The footer is `px-4 py-3` on the card fill.

## Detail views

### Auditoría tab (lead, 2026-11-13): mandatory
- **Every detail view has an "Auditoría" tab**: the record's audit trail (who did what and when: alta, edits with before → after values, status changes, approvals/declines, documents, corrections).
- Detail views with tabs add it as the **last tab**. Detail views without tabs get a tab bar with at least the main tab and "Auditoría".
- Rows: fecha/hora (`font-data`), usuario, acción, detalle of the change. Newest first. Empty: the flat empty state.

### Page shape
- **Every detail page is one `panel`** (`05`) that opens with the shared page header (`app-encabezado-pagina`, `px-8 pt-8 pb-6`):
  - the page's single `h1` (`text-large-title`, the `h1` default)
  - a **back link** (`backLink`/`backLabel`, e.g. "Volver a clientes") that returns to the exact list view the user left (filters, page, sort): the list passes its path and query params as router history state (`ListaUrl.backState()`), and a deep link falls back to the plain list (lead, 2026-11-20)
  - a **`meta` slot** for the status pill beside the title
  - right-aligned actions: `btn-secondary` "Editar", plus the state change as `btn-primary`/`btn-danger`
  - the header owns its `pb-6`; **no breadcrumbs**
- **Body:** `<section>`s inside the panel, split by `border-t border-line` (`px-8 py-8`); two short sections may sit side by side (`xl:grid-cols-2` with a `divide-x divide-line`). Each section is `aria-labelledby` its `<h2>` ("Ficha", "Historial", …).
- **Rich entities (the "360" shape, e.g. a client):**
  - a header section with the name (`text-title-2`), status pill, tag chips (`rounded-full` neutral `px-2 py-0.5 text-caption-1 font-bold`), quick actions as bordered `.row-action size-10` circles, and secondary buttons
  - an optional `callout-danger` banner for blocking state
  - below it, **tabs** inside the same panel (the tab bar sits on a hairline), with the general data in the first tab

### Not found (lead, 2026-11-20)
- One not-found page for every detail, `app-record-not-found`: the page header with its back link, the flat empty state and a button back to the list.

### Field grid (key/value)
- Use a semantic **`<dl class="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">`** with one `<div>` per field:
  - `<dt class="micro-label">`
  - `<dd class="mt-0.5 text-subheadline font-bold text-ink">`
- **Empty values render `—`**, never blank and never "N/A".
- Numeric/ID/date values get `font-data tabular-nums`.
- Related entities render as `.link-action` router links inside the `<dd>`.
- Enum values (status, origin) render as status pills inside the `<dd>`.
- Free-text notes go below the grid as a tinted block (`mt-4 rounded-lg bg-panel-muted px-3 py-2 text-subheadline`), not a bordered box.

### Related lists inside a detail card
- Short related lists (history, linked records) use a divided list: `<ul class="mt-4 divide-y">` with rows as `flex justify-between gap-3 py-2.5`.
  - Leading: a `link-action` + a `text-caption-1 text-ink-muted` meta line (dates in `font-data`).
  - Trailing: a `.row-action` with an `aria-label`.
  - `@empty`: `py-6 text-center text-subheadline text-ink-muted`, with one sentence.
- Anything paged, sortable or long becomes a `.card-flush-table` inside the section.

### Loading
- **The skeleton mirrors the page shape:** the same panel sections, each with a `skeleton max-w-24` heading and 4 label+value skeleton pairs (`max-w-24` / `mt-2 max-w-48`), wrapped in `role="status"` + `aria-label="Cargando …"`. No centered spinner.

### Forms vs detail
- Create/edit are **separate pages** (`<lista>/nuevo`, `<lista>/:id/editar`), consistent with the master plan. Only short confirmations are dialogs.

## How this sits on our look
- **Light mode:** each page is a white `panel` on the **silver pane**; tables and cards live inside it.
- **Dark mode:** the panel takes the dark `bg-panel` fill on the flat Neuro pane, with neutral shadows. Glow is reserved for ECharts series in dark mode.

## List behaviors (copied from manttio, decided 2026-11-13)
- **Server-side lazy paging and sorting.** List endpoints take `pagina` / `limite` / sort / filters. TanStack runs with `manualPagination` + `manualSorting`, so it holds UI state only and the API does the work.
- **URL-persisted filters + page.** Every list page keeps its filters, page and sort as GET query params and loads **only** from the `queryParamMap` subscription. Back/forward walks the filter history, and filtered views are shareable.
  - A component-provided `ListaQueryService` (manttio's `ListQueryService`) owns:
    - page clamping
    - filter→URL navigation (an empty value drops its param)
    - page changes
    - the refetch/step-back refresh when a page empties
  - The component keeps only its read/write param mapping. **Sanitize on read:** whitelist enum params, validate and clamp everything else, so garbage never reaches state or the API.
  - Never hand-roll filter/pagination wiring in a component.
- **Filters live in a popover.** The shared `filtros-popover` is a `Filtros` trigger (filter icon + active-count badge) placed **left of the page's primary action**, instead of an always-open filter grid. The table claims the reclaimed space.
  - The active count and "Limpiar" both derive from the URL params.
  - Overlay controls projected inside the popover keep their overlay inside the popover DOM (no portal to `body`).
  - The popover's height follows the window (`popover-height` utility) (lead, 2026-11-20).
  - **Active filters show as removable chips** under the view tabs (shared `app-filter-chips`, with «Limpiar filtros») (lead, 2026-11-20).

## Decisions (2026-11-13)
| Topic | Decision |
|---|---|
| Table primitive | **Spartan helm table + `@tanstack/angular-table`** (Spartan's data-table recipe). Faster to build sort/paging/column state. |
| Tokens | ~~manttio names~~ → **onp semantic tokens** (lead, 2026-11-16; `05`): `canvas`, `panel`, `panel-muted`, `line`, `line-strong`, `ink`, `ink-muted`, `ink-subtle` over our `surface-0…1000`, plus `primary`/`accent` 50…1000, status scales and `font-data`, **mapped onto Spartan's shadcn variables** (`--background`, `--card`, `--primary`, `--ring`, `--border`…). |
| List behaviors | **Copied:** server-side paging, URL-persisted filters/page, filters popover (see above). |
| Glow | Tables, detail cards and data surfaces use neutral shadows in both modes. **The Neuro chrome has no glow** (lead, 2026-11-16). **Chart glow only in dark mode.** On the light silver pane, charts are flat lines + a subtle single-hue area fill. |

| Typeface | **Zain** (Google Fonts) for UI and `font-data`. Real `tnum` verified: all ten digits are 491 units wide with `tnum` on. Static weights 200/300/400/700/800/900, **no 500/600**, so the weight ladder is **400 body · 700 emphasis/labels/`<dd>` · 800 hero numerals**. manttio's `font-medium`/`font-semibold` map to 400/700 and are never set at 500/600 (no synthesized weights). |

## OPEN: needs the lead's call
None.

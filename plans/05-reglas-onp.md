# 05 — Code and visual rules taken from onp

> Source: `onp-whitelabels/admin-webapp/CLAUDE.md` and the `onp-visual-language` skill (`.claude/skills/onp-visual-language/`), compared with `onp-whitelabels/admin-webapp/src/styles.css`. The lead asked for `superadmin-webapp`, which doesn't exist; the lead picked `admin-webapp` instead.
> Decided by the lead on 2026-11-16. Applied to admin-webapp the same day.

## Decisions (lead, 2026-11-16)
| onp rule | Decision |
|---|---|
| PrimeNG for all controls | **Not adopted.** We keep **Spartan UI**. |
| Icons from `@lucide/angular` | **Not adopted.** We keep **`@ng-icons/lucide`**. onp's icon sizes are adopted (see below). |
| Warm neutral surfaces, warm near-black dark mode | **Not adopted.** We keep the **Neuro Bank navy chrome plus the silver pane**. |
| No gradients, no glow | **Partly adopted.** The **silver pane gradient stays**. **Glow on the dark chrome is removed** (sidebar, active nav, access brand card, dark pane). **Glowing ECharts series in dark mode stay.** |
| Work Sans + Archivo, weights ≤ 600 | **Not adopted.** We keep **Zain** (400 · 700 · 800). The HIG text-style sizes are adopted (see Typography). |
| Semantic tokens (`canvas`, `panel`, `line`, `ink`) | **Adopted.** They replace the manttio token names from `01`. |
| Flat empty state (no card, border or icon disc) | **Adopted.** |
| One `panel` per page, sections split by hairlines | **Adopted.** |
| Code-writing rules (architecture, member order, constants, no arbitrary values, text styles, tokens only, shell) | **Adopted** (the "also" in the lead's option 2). |

## Architecture (from onp `admin-webapp/CLAUDE.md`)
- **Services only wrap HTTP:** no state and no business rules. In Phase 1 the backend is simulated by `interceptors/simulacion-api/` (an HTTP interceptor plus `ApiSimulada`), so the services already make the real calls (`/api/...`). Phase 2 deletes that folder and its line in `app.config.ts`.
- **NGXS states** hold all app state and side effects. Components read with `select()` and write with `dispatch`.
- **`utils/<topic>/`** holds pure functions, each with a spec next to it.
- **`data/constants`** holds literals only: no functions and no derived values. This includes state defaults (`AUTENTICACION_INICIAL`, `SESION_INICIAL`, `TEMA_INICIAL`).
- **No type or constant declarations** in components, states or utils:
  - interfaces go one per file in `data/interfaces/`
  - types go in `data/types/<topic>.types.ts`
  - constants go in `data/constants/`
  - One-off strings stay inline. A class-to-tone map used by one component may stay as a non-signal property of that component (onp's `dotClasses` rule).
- Store layout: `store/<module>/{actions,state,types}`. Forms are pages.
- **Spanish copy:** fix accents and grammar in copy the lead types, and show the corrected version.

## Components
- Template in its own `templateUrl`; standalone; OnPush; `protected` for template-only members.
- **Class member order,** with a blank line between groups:
  1. injections
  2. `input()`
  3. `output()`
  4. forms
  5. `model()`
  6. view/content queries
  7. `signal()`
  8. read-only signals (`select()` counts here)
  9. `computed()`
  10. non-signal properties
  11. host bindings
  12. constructor and effects
  13. lifecycle hooks
  14. `@HostListener`s
  15. methods
  16. single-use helpers
- **No arbitrary Tailwind values** (`h-[…]`, `text-[…]`, `[&…]:`, `shadow-[…]`). Use standard scale utilities, tokens, or a named utility/variant in `styles.css` (e.g. `scrollbar-thin`, `pagina-actual:`).
- **No inline function calls in templates** beyond signal reads and event handlers. Use computed signals, pure pipes or a method.
- Spacing and sizing go in utilities, not component CSS.
- **Icons (ng-icon `size`):** 18 nav · 16 buttons · 14 inline · 28 at `strokeWidth` 1.5 for empty states.

## Tokens (`src/styles.css`)
| Token | Light | Dark | Use |
|---|---|---|---|
| `bg-canvas` | surface-200 (the silver pane's flat stand-in) | chrome-pane | Behind panels |
| `bg-panel` | surface-0 | surface-900 | Panels, cards |
| `bg-panel-muted` | surface-100 | surface-800 | Hover rows, nested areas |
| `border-line` | surface-200 | mix of 700/900 | Dividers, card borders |
| `border-line-strong` | surface-300 | surface-700 | Inputs, emphasized edges |
| `text-ink` | surface-950 | surface-50 | Primary text |
| `text-ink-muted` | surface-600 | surface-400 | Descriptions, secondary text |
| `text-ink-subtle` | surface-500 | surface-500 | Captions, placeholders, empty-state icons |
- `surface-0…1000` stays our cool hue-260 scale. `chrome-*` stays fixed Neuro navy (sidebar, outer canvas), plus a new `chrome-hover`.
- Spartan's shadcn variables (`--background`, `--card`, `--muted`, `--border`, `--input`…) point at the semantic tokens, so helm components follow them.
- **Status scales** `success-*` `warning-*` `danger-*` `info-*` (onp values: emerald, amber, rose, sky). Dots use 500; text uses 700 in light and 400 in dark; tints use 50/100. No raw palette colors (`red-*`, `amber-*`), and no `white`/`black`.
- **Radius:** sm 8 · md 12 · lg 16 · xl 20 (cards) · 2xl 24 (panels, the sidebar card, the pane).
- **Shadows** (elevation only): `xs` cards, `panel` page panels, `md`, `lg` overlays. The `panel`/`card` recipes read `var(--shadow-*)` so dark mode can deepen them.
- **Recipes:** `panel` = `rounded-2xl bg-panel` + panel shadow; `card` = `rounded-xl border border-line bg-panel` + xs shadow.
- **Motion:** `--ease-soft`; `animate-page-in` (320 ms fade + 6 px rise) once per page, on the root panel. Links and buttons get `transition-colors duration-150 ease-soft`.
- **Focus:** our own controls get a 2 px `primary-500/60` outline; helm components keep their own ring.

## Typography (onp's HIG sizes in Zain)
| Utility | Size/leading | Weight (Zain) | Use |
|---|---|---|---|
| `text-display` | 60/60 | 800 | Hero number inside a visual |
| `text-large-title` | 34/41 | 700 | Page title (`h1` default) |
| `text-title-1` | 28/34 | 700 | Secondary metrics, the sidebar greeting name |
| `text-title-2` | 22/28 | 700 | Section titles (`h2` default) |
| `text-title-3` | 20/25 | 700 | Dialog titles, brand name |
| `text-headline` | 17/22 | 700 | Subsections (`h3`/`h4` default), row titles |
| `text-body` | 16/24 | 400 | Body default |
| `text-callout` | 15/22 | 400 | Descriptions under titles |
| `text-subheadline` | 14/20 | 400 | Table cells, secondary lines |
| `text-footnote` | 13/18 | 400 | Form helper and error text |
| `text-caption-1` | 12/16 | 400 | Timestamps, metadata, `.micro-label` |
| `text-caption-2` | 11/14 | 400 | Chart ticks |
- Never `text-sm`/`text-lg`/… in our markup. Spartan's generated helm code in `libs/ui` keeps its own sizes.
- **Weights:** Zain has no 500/600, so onp's 600 roles take 700, and onp's 500 roles (labels, buttons, nav) take 400, or 700 when they need emphasis. Never synthesized weights.
- `libs/ui/utils` `hlm()` registers these sizes with tailwind-merge. Without that, `text-body` would knock out a helm component's text color.

## Shell
- `h-dvh overflow-hidden`: exactly one screen tall. The sidebar is not sticky; it sits at `h-full` and its nav scrolls inside it.
- The silver pane doesn't scroll (so its gradient and grain stay put). **Only the content inside it scrolls** (`#contenido`), and `Marco` resets it to the top on each navigation.
- The theme switch **stays in the sidebar**. onp keeps it in an account popover; that is option 2 of the open 1366×768 sidebar question.

## Page anatomy
```html
<article class="panel animate-page-in">
  <app-encabezado-pagina titulo="…" descripcion="…"><!-- secondary actions, then the one primary --></app-encabezado-pagina>
  <section class="flex flex-col gap-12 border-t border-line px-8 py-12">
    <header>
      <h2>Section title</h2>
      <p class="max-w-prose text-callout text-ink-muted">What this section is for.</p>
    </header>
    <!-- subsections: <h3 class="mb-3">…</h3> + content -->
  </section>
</article>
```
- Header `px-8 pt-8 pb-6`. Sections are separated by space and `border-t border-line`; cards only for content that stands on its own. Never a card in a card.
- **Admin forms:** grouped sections (title + one-line description on the left, fields on the right, `lg:grid-cols-3`), `gap-y-4` between fields, `gap-x-6` between columns, sections `py-8`, **no `max-w-*`** on page roots or forms (only `max-w-prose` on prose). Section saves sit at the bottom right of their own field grid; one primary per view.
- **Empty state,** flat in the panel:
```html
<div class="flex min-h-60 flex-col items-center justify-center gap-3 p-8 text-center">
  <ng-icon name="…" size="28" [strokeWidth]="1.5" class="text-ink-subtle" aria-hidden="true" />
  <div>
    <p class="text-headline">One line of what's missing</p>
    <p class="text-callout text-ink-muted">One sentence of guidance.</p>
  </div>
  <!-- one small action, if any -->
</div>
```
- **Metrics:** one card with figures divided by hairlines, the first one leading. No rows of colored stat tiles.
- **Horizontal overflow** (tables, boards) gets a scroll-fade directive (onp's `appScrollFade`). Not built yet: no screen scrolls sideways so far.
- **Avoid:** gradient text, glass blur, icons in colored squares, rows of equal colored stat cards, uppercase tracking-wide eyebrows, centered hero layouts inside the app, arrow glyphs on CTAs, dead hover/focus states.

## OPEN: needs the lead's call
- **Form actions:** `02` plans a sticky action bar on the client form; onp puts Cancelar/Guardar at the bottom right of the last section (or each section's own save). Which one?
- The 1366×768 sidebar fit (from 2026-11-16): the nav shows 469 of its 618 px, and Administración sits below the fold. The options are the same four as before (hide the greeting on short screens, move the theme switch into an account menu, tighten rows, keep scrolling with a fade).

# Centro cambiario: demo shell

Whitelabel demo for Mexican centros cambiarios (currency exchange houses). Two Angular apps, with **no shared code** (each owns its UI kit, theme pipeline and data layer):
- `admin-webapp/`: the admin console. Neuro sidebar plus silver pane.
- `cashier-webapp/`: the cashier app (ventanilla). Neuro top bar plus a full-width silver pane, with touch-sized controls (44 px).

A change that applies to both apps is made in both.

## Who decides
- **The tech lead decides project direction.** The product manager builds features under the lead's guidance, and the lead polishes them afterwards.
- **Claude never decides direction:** no new libraries, patterns, screens, scope or visual choices on its own. When something isn't covered by `plans/` or this file, present the options with a recommendation and let the person pick. When a choice changes the plans or the rules, note it so the lead can review it.
- Commit or push only when asked.

## Read first
`plans/` is the source of truth. Read the plan for the area before touching it:

| Plan | Covers |
|---|---|
| `00-master-plan.md` | Scope, phases, progress log, open questions |
| `01-table-detail-rules.md` | Tables, detail pages, filters, empty states |
| `02-clientes-movimientos.md` | Clientes and Movimientos screens |
| `03-expediente-cliente.md` | Client file (expediente) |
| `04-negocio.md` | Business settings, branding |
| `05-reglas-onp.md` | **Code and visual rules** (architecture, member order, tokens, typography, page anatomy) |
| `catalogos/` | Official catalogs (Banxico, SAT, etc.) as JSON |

Items marked **OPEN** in a plan are waiting on the lead. Don't resolve them on your own.

## Stack
- **Angular 22:** client-side only, zoneless, OnPush, signals, standalone components.
- **Spartan UI** (helm components generated in `admin-webapp/libs/ui`).
- **Tailwind 4:** tokens, `@utility` and `@custom-variant` in `src/styles.css`.
- **NGXS** for state, plus its storage plugin.
- **`@ng-icons/lucide`** for icons. **Zain** is the only font.
- Path aliases: `@data/*`, `@components/*`, `@interceptors/*`, `@layout/*`, `@modules/*`, `@pipes/*`, `@services/*`, `@store/*`, `@utils/*`.

```bash
cd admin-webapp    # or cashier-webapp
npm install
npm start          # dev server: admin http://localhost:4200, cashier http://localhost:4201
npm run build      # production build (a 500 kB budget warning is known)
npm test           # unit tests (Vitest)
npm run deploy     # build + wrangler deploy (Cloudflare Workers, static assets)
```

Each app has a `wrangler.jsonc`: it serves `dist/<app>/browser` and falls back to `index.html` for deep links. With Cloudflare's Git integration, set the root directory to the app folder, the build command to `npm run build`, and the deploy command to `npx wrangler deploy`.

Before saying something is done, run `npm run build` and `npm test`. Check the screen in the browser in both light and dark mode.

## Hard constraints
- **No backend yet (Phase 1).** Services make real HTTP calls to `/api/...`. `interceptors/simulacion-api/` answers them in the browser. New endpoints go in `RUTAS_API` (`data/constants/api.constants.ts`) and in `ApiSimulada`.
- **Persistence:** NGXS plus localStorage only. No IndexedDB, no SQLite, no other store.
- **No route guards** until Supabase is set up.
- **Devices:** the admin console is desktop only, at least 1366×768. The cashier app will be desktop plus tablet. No phone layouts, and no phone screenshots.
- **Test logins:** the password is always `Password123#!` and the verification code is always `0000`.
  - admin-webapp: `eduardo@testing.com` or `fernando@testing.com` (SUPERADMIN).
  - cashier-webapp: `cajero@testing.com` (CAJERO).
  - Each app accepts only its own accounts.

## Code rules (summary; details in `plans/05-reglas-onp.md`)
- Services only wrap HTTP. State and side effects live in NGXS states. Components read with `select()` and write with `dispatch`.
- `data/constants` holds literals only, including state defaults (`*_INICIAL`). Interfaces go one per file in `data/interfaces/`, types in `data/types/`. Pure functions go in `utils/<topic>/` with a spec next to each.
- Component members follow the fixed 16-group order in plan 05.
- **No arbitrary Tailwind values** (`h-[…]`, `text-[…]`, `shadow-[…]`). Use scale utilities, tokens, or a named utility in `styles.css`.
- **No function calls in templates** other than signal reads and event handlers.
- **Tokens only:** `canvas`, `panel`, `panel-muted`, `line`, `line-strong`, `ink`, `ink-muted`, `ink-subtle`, plus the `success`/`warning`/`danger`/`info` scales. No raw palette colors, no `white`/`black`.
- **Text sizes:** the HIG ladder (`text-large-title` … `text-caption-2`). Never `text-sm`/`text-lg` in our markup.
- **Pages:** one `panel` per page, sections split by `border-t border-line` hairlines, flat empty states, `animate-page-in` on the root panel.
- **Look:** Neuro navy chrome, a silver pane gradient, no glow on the chrome. Charts may glow in dark mode.

## Copy
All UI copy is **Spanish (Mexico)**, with correct accents and grammar. When copy someone types has mistakes, fix it and show the corrected version.

## Tooling in `.claude/`
- **Skills:**
  - `impeccable`: design build, critique and polish
  - `avoid-ai-design`
  - `typeset`
  - `security-audit`
  - `web-perf`
- **Agents:** `impeccable-*`, used by the impeccable skill.
- **Hooks** (`.claude/settings.json`): impeccable checks UI files after each edit and runs a deeper design pass when Claude stops.
  - The first run downloads the impeccable engine for your OS (Windows, macOS or Linux) and checks it against `engine-checksums.txt`.
  - On Windows this needs Git for Windows, which Claude Code requires anyway.
- **Personal settings** go in `.claude/settings.local.json`, which is gitignored.

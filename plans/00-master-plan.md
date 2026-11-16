# Plan: Centro Cambiario shell (cajero + admin)

> **Status: DRAFT.** Phase 1 in progress: the admin-webapp **shell + auth screens** are built (2026-11-13). Items marked **OPEN** are the lead's decisions to make.

## Context
This repo is a clean rebuild ("facewash") of `../../demos/centro-cambiario-demo/centro-cambiario-demo`. The demo stays untouched as a reference for screens, flows and domain vocabulary only. **No code, services or sql.js are ported.** The impeccable skill polishes the result.

## Decisions (confirmed 2026-11-10 → 11-13)
| Topic | Decision |
|---|---|
| Repo layout | Three folders, like onp: `admin-webapp/`, `cashier-webapp/` (Angular) and `backend-api/` (Hono). The root scaffold goes away. |
| Shared code | **None.** Each webapp owns its own UI components, theme pipeline and data layer, so a change in one can never break the other. |
| Backend | `backend-api/`: **Hono on Cloudflare Workers + Supabase**. It holds **branding, all domain data, users and OTP (including resend)**. Both apps call it. |
| Auth | **Our own auth** in `backend-api` (own users table + OTP, **not** Supabase Auth). **No login/OTP guards** in the webapps until the Supabase project is provided. Login and OTP screens are built, but routes stay open. |
| Rendering | **Pure CSR.** Static Angular builds, which is fine for a demo. No SSR/Express. Branding loads from the API at startup. |
| Deploy | **Cloudflare Workers** for the API and both webapps (static assets). Testing and demo instances only. |
| State | **NGXS**, onp style: `store/<modulo>/{actions,state,types}`, storage plugin for persistence, and components use `select()` / `dispatch()`. |
| UI kit | **Spartan UI** (`@spartan-ng/brain` 1.9.0, Angular 22 OK). Helm components are generated into each app. |
| Charts | **ECharts** through an Angular wrapper. |
| Language / naming | **Spanish only:** identifiers, routes, domain names and copy. |
| Modes | Dark + light + system toggle. |
| Devices | (lead, 2026-11-16) **admin-webapp: desktop-only**, never used on a phone. Smallest screen it must fit: **1366×768**. The shell's existing small-screen layout stays as is. **cashier-webapp: desktop and tablets** (touch-sized controls), no phones. |
| Whitelabel | Runtime branding + admin editor (onp admin-webapp model): name, logo, favicon, **primary + accent** colors. Each color expands from one base to an OKLCH 50–1000 scale. **Backgrounds and surfaces are not customizable.** |
| Look | See *Visual direction* below. |
| onp rules | (lead, 2026-11-16) onp admin-webapp's code rules plus its semantic tokens, flat empty state and one-panel-per-page are adopted; PrimeNG, `@lucide/angular`, warm surfaces and its fonts are not. See [`05-reglas-onp.md`](05-reglas-onp.md). |
| Roles (seed) | **SUPERADMIN** (all privileges) and **CAJERO**. No cajero test account for now. **Interim access rule:** OFICIAL_CUMPLIMIENTO and ADMIN see the whole admin app; CAJERO is limited to the cashier app. The full role mapping is still OPEN (`03` O-0.1). |
| Copy terms | "**Usuario**" means internal staff and "**Cliente**" means customers, everywhere. |
| Test users | `eduardo@testing.com` and `fernando@testing.com`, SUPERADMIN, password `Password123#!`, OTP always `0000`. |
| Currencies | **MXN is the base.** USD, EUR, JPY, CNY (renminbi) and KRW are quoted against it. Keys are **ISO 4217** (`03` D-18). |
| First build | **The admin-webapp shell for the superadmin.** |
| Phase 1 data | **Mock data for the dashboard** (typed fixtures behind the service layer). Phase 2 replaces them with API calls. |
| Persistence | **None outside NGXS** for now: no sql.js, SQLite or IndexedDB. Fixtures seed NGXS state. |

## Visual direction
- **Dark mode = Neuro Bank, end to end:**
  - deep navy/black canvas and a dark main container
  - a floating sidebar card with the logo, the "Bienvenido de nuevo" greeting and the date
  - a pill nav whose active item sits on a lighter surface
  - glowing ECharts area/line charts. **No glow on the chrome** (lead, 2026-11-16): sidebar, nav, access card and dark pane are flat
- **Light mode = metallic white:** the sidebar card and outer canvas **stay Neuro dark**. Only the main right container becomes the silver pane from `Jobs/DASOM/quotations/cotizacion-onp-site/index.html`:
  - a vertical gradient `#e3e6e7 → #cdd2d4`
  - five layered radial highlights and shadows
  - a fractal-noise SVG grain at ~10% opacity in `multiply` (`::before`, `isolation: isolate`)
- Both modes: one rounded `panel` per page (24px) with sections split by hairlines, cards (20px) only for self-contained content, pill status badges, and one saturated brand primary for CTAs. Tokens and type: `05`.
- Tenant brand colors only touch primary/accent tokens (CTAs, active nav, focus ring, charts, badges). Mode surfaces (Neuro dark, silver pane) are fixed.

## Scope

### admin-webapp (first)
| Module | Screens |
|---|---|
| auth | Login, OTP (with resend), logout |
| inicio | KPI dashboard: volume, spread, by branch/currency, charts |
| negocio | **Centro cambiario profile** (tenant config): tabs **General · Legal · Sucursales · Auditoría**. Branches live inside it (list as a tab, forms and branch detail as pages). See `04-negocio.md`. |
| tipos-cambio | Current rates per branch/currency vs MXN, edit, history |
| operaciones | Read-only buy/sell operations with filters, plus a detail page |
| caja | Read-only drawers/vault, sessions, conteos (apertura/arqueo/corte) |
| movimientos | Read-only cash logistics: inter-drawer/inter-branch traspasos, traslados de valores, replenishments |
| contabilidad | Ledger: balances per branch/currency, cortes, totals |
| reportes | Aggregated reports, export |
| bitacora | Audit log |
| usuarios-admin | Admin users (own menu item) |
| usuarios-cajero | Cashier users (own menu item) |
| clientes | List, detail, **full expediente create/edit (superadmin only)**, see `02` and `03` |
| apariencia | Branding editor: name, logo, favicon, primary + accent with a live preview |

### cashier-webapp
| Module | Screens |
|---|---|
| auth | Login, OTP (with resend), logout |
| inicio | Today's rates, my drawer balance per currency, today's operations |
| operaciones | List; new operation (compra/venta) as a stepped page: client → currency/amount → confirmation/receipt |
| caja | Open drawer, entradas/salidas, corte |
| clientes | List, register (page form), detail |

**Dropped from the demo:** PLD/FT, alerts, monitoring, blacklists, catalogs, parameters, SQL console, backup, anonymous mailbox.

## Architecture per webapp
- Angular 22, standalone, zoneless, OnPush, signals, `inject()`, templates in their own `.html`.
- Conventions taken from onp admin-webapp:
  - `services/` (thin HTTP to `backend-api`), `store/`, `utils/<topic>/`
  - `data/{constants,dto,interfaces,types}`
  - Forms are pages (`<lista>/nuevo`, `<lista>/:id/editar`); confirmations are dialogs.
- **Theme pipeline:**
  1. `ThemeState` loads branding from the API and expands primary/accent into scales.
  2. It maps those scales onto Spartan/shadcn CSS variables (`--primary`, `--ring`, `--chart-*`…).
  3. It sets the mode class, persisted with the storage plugin.
  - The fixed tokens (chrome, silver pane, surfaces) live in `styles.css`.

## Process
1. Copy the impeccable skill from `onp-whitelabels/.claude/skills/impeccable` (plus `skills-lock.json`).
2. `impeccable init` → PRODUCT.md (cajeros working fast at the counter, superadmins supervising).
3. `impeccable shape` for admin-webapp, using the Neuro Bank shots + the silver pane → DESIGN.md. Operate mode.
4. **Phase 1, admin-webapp shell:**
   - scaffold in `admin-webapp/` and remove the root scaffold
   - Tailwind 4 + Spartan, theme pipeline, layout (dark chrome + silver pane), nav for all admin modules
   - login + OTP screens, an empty-state page per module, and the `inicio` dashboard
   - green build, then an `impeccable critique`/`polish` pass
5. Phase 2, once the Supabase project is provided:
   - `backend-api/`: Hono + Supabase schema, seeding users/roles/currencies, our own login + OTP + resend, branding
   - in admin: wire branding and auth, and turn on the login/OTP guards
6. Later phases: admin modules, then cashier-webapp, each followed by impeccable passes.

## Progress
- **2026-11-13, Phase 1 shell + auth (admin-webapp):**
  - root scaffold removed; Angular 22 CSR app in `admin-webapp/`
  - Tailwind 4 + Spartan 1.9 (helm in `libs/ui`), NGXS (`tema`, `sesion`, `autenticacion`; only `tema.modo` persists, in localStorage)
  - theme pipeline: branding fixture → OKLCH 50–1000 scales → Spartan variables; Sistema/Claro/Oscuro
  - shell: Neuro sidebar + silver/dark pane, nav for every module (placeholder pages), mobile sheet
  - `/acceso` (login) and `/acceso/verificacion` (OTP + resend after 30 s), no guards; auth simulated in the browser against the test users until Phase 2
  - Zain self-hosted with re-centered vertical metrics
  - not done yet: `inicio` dashboard with mocks, impeccable init/shape/critique/polish
- **2026-11-16, onp rules applied (`05`):**
  - semantic tokens, status scales, onp radius/shadow scale, HIG text styles in Zain
  - one-screen shell (only the content pane scrolls), chrome glow removed, flat empty states, one panel per page
  - services are thin HTTP; Phase 1 answers them from `interceptors/simulacion-api/`
  - constants, interfaces and state defaults moved to `data/`; member order fixed; no arbitrary Tailwind values

## Related plans
- [`01-table-detail-rules.md`](01-table-detail-rules.md): table and detail-view styling rules, copied from manttio-whitelabeled/superadmin.
- [`02-clientes-movimientos.md`](02-clientes-movimientos.md): clientes, operaciones and caja, planned from the centro-cambiario-demo.
- [`03-expediente-cliente.md`](03-expediente-cliente.md): full client expediente spec + decisions D-1…D-20.
- [`04-negocio.md`](04-negocio.md): centro cambiario profile + sucursales.
- [`05-reglas-onp.md`](05-reglas-onp.md): code and visual rules taken from onp admin-webapp.
- [`catalogos/`](catalogos/README.md): official CNBV / Banxico catalogs as JSON fixtures.

## OPEN: needs the lead's call
- The 1366×768 sidebar fit (`05` OPEN).
`negocio` is drafted in `04-negocio.md`.

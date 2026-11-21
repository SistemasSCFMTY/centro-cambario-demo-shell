# 02 — Clientes + movimientos

> **Status: DRAFT.** Reference: `demos/centro-cambiario-demo/centro-cambiario-demo`, modules `clientes`, `operaciones` and `caja`, plus their `services/` and `model/`. Behavior and vocabulary only; no code is ported.
> UI rules: `01-table-detail-rules.md`. Items marked **OPEN** are the lead's decisions to make.

## What the demo has (inventory)

### Clientes (demo route `/usuarios`)
- **List:** a single free-text search (name/denominación, número, CURP, RFC, ID) and the latest registered clients when there's no query. Columns:
  - Número (mono)
  - Nombre (with a "Persona moral" pill and a "PEP" pill)
  - Nacimiento/constitución
  - CURP/RFC
  - Expediente (nivel badge)
  - Riesgo
  - Estatus

  The whole row opens the expediente. The empty state differs for "no results" vs "no clients yet".
- **Form** (`nuevo`, `:id/editar`, one page):
  - Tipo de persona **PF/PM** (only on create).
  - **Nivel selector 1/2/3:** each level unlocks sections, fields and required documents. The level can never go below the current one.
  - **~18 sections** driven by `SECCIONES_CLIENTE`, with fields declared in `CamposClienteService` (~500 lines: per-persona, per-nivel, conditional visibility/requirement, validators, warnings).
    - PF: identidad, identificación, domicilio (+ domicilio MX for foreign residents), contacto, PEP, perfil transaccional, declaración por cuenta propia.
    - PM: datos, domicilio, contacto, representantes (table), quien comparece, accionistas (table), propietarios reales (table, with a "proponer" button).
    - Common: documentos (upload + cotejo), riesgo criteria, high-risk questionnaire (only when risk is ALTO).
  - Sticky action bar: "N pendientes para nivel X" / "Completo para nivel X", estimated risk, Cancelar/Guardar.
  - On save: a **duplicates dialog** (name similarity) and a **revision dialog** (blacklist hits / alerts).
- **Expediente (detail):**
  - Header: name, número, PF/PM, alta date, pills (nivel, riesgo, PEP, estatus), "can operate up to…", and the estatus motive (only for roles that see the real status).
  - Actions: Completar/subir de nivel or Editar, "Aviso al Oficial", "Cambiar estatus".
  - Cards: completitud por nivel, datos (label/value grid), PM persons (representantes / accionistas / propietarios tables), documentos (file, date, cotejado, SHA-256, Ver), client's operations, risk calculation, listas negras hits, alerts.
- Statuses: `ACTIVO | SUSPENDIDO | BLOQUEADO`. Risk: grado BAJO/MEDIO/ALTO.

### Operaciones (exchange buys/sells)
- **List:** tabs HOY / PENDIENTES / TODAS. Columns:
  - Folio (+ "Relevante" pill)
  - Fecha + cajero
  - Tipo + divisa + instrumento
  - Monto divisa
  - T.C.
  - Pesos
  - Equiv. USD
  - Cliente (link) or "Usuario ocasional"
  - Estatus (+ authorization motive/comment)
  - Revisar (authorizers only)
- **Nueva operación** (one page, numbered cards, with a draft that survives leaving to register a client):
  1. **Operación:**
     - Compra/Venta as big choice buttons ("el usuario entrega divisas y recibe pesos" / the reverse)
     - Divisa, instrumento, monto en divisa, tipo de cambio (prefilled from the ventanilla rate, editable)
     - Live calculation: pesos to give/receive, USD equivalent at the previous business day's FIX, required ID level, classification (Relevante / reporte efectivo USD / ordinaria)
  2. **Cliente:** pick an existing client (search) or type an "ocasional" name. Warns when the client's expediente level is below the required one and links to complete it, or to create a client.
  3. **Origen y destino de los recursos** (catalog selects, only with a registered client).
  - Action bar: summary line, "Disponible hoy: X USD de límite", Limpiar / Registrar.
  - Result dialog: folio, status (COMPLETADA or PENDIENTE_AUTORIZACION + motives).
  - Guards: no FIX rate → blocked. Cash operation without an open drawer → warning with a link to Caja.
- Statuses: `COMPLETADA | PENDIENTE_AUTORIZACION | RECHAZADA | CANCELADA`. The authorization dialog handles approve/reject + comment.

### Caja (cash drawer, demo route `/caja`, five tabs)
- **Mi caja:**
  - **Open:** header (caja · sucursal · opened at · responsable), actions (+ Entrada, − Salida, Enviar traspaso, Corte de caja), and a **per-currency balance table** (inicial / entradas / salidas / actual).
  - Below that: "Traspasos por recibir" and "Movimientos de este turno".
  - **Closed:** an explanation + available drawers + "Abrir caja", where opening is a currency count (conteo de apertura).
- **Cajas:** all drawers/vaults with status and responsable (supervisors).
- **Movimientos:**
  - filters: desde/hasta, sucursal, caja, moneda, tipo, responsable
  - per-currency totals pills (`+entradas / −salidas = neto`)
  - table: fecha, caja·sucursal, tipo, moneda, entrada, salida, descripción, responsable (+ "registró" if different)
  - Excel export
- **Traspasos:** transfers between drawers (EN_TRANSITO → RECIBIDO | CANCELADO).
- **Cortes:** counts history (APERTURA / ARQUEO / CORTE), system vs counted per currency with the difference.
- **Movimiento dialog:**
  - moneda (shows existencia), monto, concepto, detalle (required for "Otro…")
  - Entrada concepts: Dotación de banco, Fondo fijo, Reposición de fondo, Otro ingreso
  - Salida concepts: Depósito a banco, Retiro para traslado de valores, Gasto menor, Otro egreso
- Movement types: `EXISTENCIA_INICIAL, OPERACION, DOTACION, RETIRO, OTRO, TRASPASO, DEVOLUCION_TRASPASO, DIFERENCIA_APERTURA, DIFERENCIA_CORTE`. Cash operations write OPERACION movements automatically (compra: currency in, MXN out; venta: the reverse).

## Decisions (2026-11-13)
| Topic | Decision |
|---|---|
| Module split | **Movimientos and caja (drawer) are separate modules.** Cash also moves **between branches**, through **traslado de valores** (secured cash-in-transit) and through **cash replenishments**, which don't belong to one drawer's shift. |
| Clientes depth | **Full expediente**, specced item by item in `03-expediente-cliente.md`. |
| Operation rules | **All the same rules as the demo**: FIX + USD equivalent, required level, Relevante/reportable classification, authorization flow, origen/destino, daily USD limit, instruments, occasional clients. |
| Caja scope | **Everything in the demo:** apertura/corte counts, entradas/salidas, arqueos, traspasos, bóveda, drawer admin. |
| Build order | **Admin read-only views first** (mock data), cashier capture later. |
| Admin capture | **Superadmin can create/edit clientes** in admin. Only superadmin, for now. |
| Persistence | **No persistence outside NGXS.** No sql.js, SQLite or IndexedDB. Mock fixtures load into NGXS state. |

## Module map
| Module | Covers |
|---|---|
| `operaciones` | Exchange buys/sells (compra/venta) with the demo's rules. |
| `caja` | Drawers and vault: sessions (apertura → corte), conteos (apertura/arqueo/corte), entradas/salidas within a shift, drawer admin. |
| `movimientos` | Cash logistics not tied to one shift: traspasos between drawers **and between branches**, **traslado de valores** (secured transport out/in), **replenishments** (dotaciones), with status tracking (e.g. en tránsito → recibido / cancelado). |

## Proposed shape in our apps

### cashier-webapp (later)
| Route | Page | Notes |
|---|---|---|
| `/clientes` | List | TanStack, URL filters, `Filtros` popover, "Nuevo cliente" primary. Lead cell `.lead-avatar`. |
| `/clientes/nuevo`, `/clientes/:id/editar` | Form page | Grouped form sections in the page panel (`05`) and a sticky action bar (lead, 2026-11-16). |
| `/clientes/:id` | Detail ("360") | Header card + tabs: General · Documentos · Operaciones. |
| `/operaciones` | List | Tabs → URL param (`?vista=hoy|pendientes|todas`). |
| `/operaciones/nueva` | Stepped page | Operación → Cliente → (Recursos) → result. Draft kept in NGXS. |
| `/caja` | Mi caja | Open/closed states, balance table, turno movements. |
| dialogs | Entrada/Salida, Apertura/Corte (conteo) | Short, so they stay dialogs (per 01). |

### admin-webapp (first)
| Route | Page | Mode |
|---|---|---|
| `/clientes` | List | read |
| `/clientes/nuevo`, `/clientes/:id/editar` | Full expediente form page | **superadmin capture** |
| `/clientes/:id` | Expediente detail ("360") | read + superadmin actions (estatus, aviso) |
| `/operaciones` | All operations, filters: fecha, sucursal, cajero, divisa, tipo, estatus, vista (hoy/pendientes/todas) | read |
| `/operaciones/:id` | Operation detail (folio, calculation, client, classification, authorization trail); the only place that shows the Equivalente en USD (lead, 2026-11-20) | read |
| `/caja` | Drawers/vault per branch: status, responsable, balances | read |
| `/caja/cortes` | Conteos history (apertura/arqueo/corte, system vs counted, difference) | read |
| `/movimientos` | Cash logistics: traspasos (drawer↔drawer, branch↔branch), traslados de valores, replenishments; filters, totals pills, export | read |
| `/movimientos/:id` | Movement detail (origin, destination, amounts per currency, status trail) | read |

Every detail view above (`/clientes/:id`, `/operaciones/:id`, `/movimientos/:id`, and caja/corte details if added) carries the mandatory **Auditoría** tab (`01`).

#### Column order (lead, 2026-11-20)
The lead column is pinned left, Estatus comes right after it, and the row actions are pinned right (`01`, `05`).
| Screen | Columns |
|---|---|
| `/operaciones` | Folio (pinned) · Estatus · Fecha · Sucursal · Operación · Importe · Cliente. **Importe** is one two-line cell: the amount in its currency, then `TC <rate> · MXN <pesos>`; it sorts by pesos. Replaces `06` P-15. |
| `/movimientos` | Folio (pinned) · Estatus · Fecha (with «Registró: <name>» under it; no Registró column) · Origen · Destino · Montos · Resolvió. |
| `/caja` | Caja pinned. |
| `/caja/cortes` | Fecha pinned. |
| `/clientes` | Cliente (pinned) · Estatus · Número · Nacimiento o constitución · CURP o RFC · Expediente · Alta. Replaces the order in `06` P-36. |
| Sucursales | `04` (Tab: Sucursales). |

### Data
- Typed mock fixtures loaded into NGXS states through `services/`. **Nothing persists outside NGXS.** A reload re-seeds from fixtures.
- Phase 2 swaps fixtures for `backend-api` calls with the same DTOs.
- Seed currencies: MXN base + USD, EUR, JPY, CNY, KRW.

## Decisions (2026-11-13, round 2)
| Topic | Decision |
|---|---|
| Three modules | **Confirmed for the demo:** `operaciones`, `caja`, `movimientos`. The lead will check how the demo and other systems model cash logistics before the production design. |
| Traslado de valores record | Transport company, guard + vehicle, seal/bag number (*marchamo*), pickup and delivery date/time, origin and destination (branch, bank), amounts per currency, status. |
| Replenishments | **Need an approval step.** Source: **a bank or another branch**. **Only superadmins approve**, for now. |
| `localStorage` | **Allowed** through the NGXS storage plugin (UI prefs such as theme mode, and the session since 2026-11-20). Domain data still comes from fixtures. |

| Replenishment review | The approving superadmin has **two paths**: (a) **decline completely**, a final state that requires a motive, or (b) **correct and then approve**: edit the request (e.g. amounts per currency) and approve it in the same review, with the correction recorded in the status trail. |

## OPEN: needs the lead's call
None in this file.

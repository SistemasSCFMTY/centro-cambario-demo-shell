# 03 — Expediente del cliente (KYC)

> **Status: DRAFT.** Reference: `demos/centro-cambiario-demo/centro-cambiario-demo` (module `clientes`, its services, model and SQL scripts). Ambiguities were checked against `CentroCambiario_Prototipo_v1.3_1.html`. This file describes **what the demo does**. Items marked **OPEN** are the lead's decisions; nothing here is decided.
> Related: `00-master-plan.md`, `01-table-detail-rules.md`, `02-clientes-movimientos.md`.

## Decisions (lead, 2026-11-13)
These override the matching OPEN items below. OPEN items not listed here stay open.

| # | Decision | Resolves / affects |
|---|---|---|
| D-1 | **Role mapping stays OPEN** (O-0.1). **Interim rule:** OFICIAL_CUMPLIMIENTO and ADMIN (and SUPERADMIN) see the **whole admin app**. CAJERO is restricted to the **cashier app only**. | O-0.1 (open), O-5.4, O-9.1, O-10.2 (see note) |
| D-2 | **Copy:** "**Usuario**" means internal staff and "**Cliente**" means our customers. All expediente copy says *cliente* (the demo's "usuario" wording is replaced: "Nuevo cliente", "Buscar cliente", "Cliente inexistente", …). | O-0.2 |
| D-3 | **Out of scope for now:** anything that needs data from the dropped modules, namely the **risk matrix** (score, scales, `crit_*`, high-risk questionnaire), **blacklists** (check on save, actions, providers, dictamen, lists card) and **their catalog risk grades**. The lead will provide the information providers later. | O-0.3, O-3.1, O-5.x, O-7.x, O-10.6, §0.4 |
| D-4 | **Documents are held as base64** in NGXS state (with the existing metadata). | O-4.1 |
| D-5 | **Not in scope for now:** alerts, the bitácora events, "Aviso al Oficial" and risk-change notices. | O-0.5, O-5.5, O-7.4, O-7.8, O-9.3, O-10.5 |
| D-6 | **Fix the demo quirks** instead of copying them (e.g. the level buttons enforce the minimum level; the questionnaire visibility and the saved grade use one source; closing the duplicates dialog doesn't silently drop the save; the "1,000 USD" text binds to its parameter). Quirks inside D-3/D-5 scope wait for those features. | O-2.1, O-2.6, O-3.6, O-3.7, O-5.3, O-7.10, O-8.4, … |
| D-7 | **The form is built from field definitions** (data-driven, as in the demo): sections + field specs with persona/nivel/required/visible/validate rules, rendered by generic field components. | O-3.11 |
| D-8 | **The detail page follows manttio's clients module** (`customer-view`): page header with back link, a **header `.card-section`** (name, status pill, tag chips, quick actions, secondary buttons), an optional `.callout` banner, then a **`.card` framing tabs** with *General* first. (Restyled 2026-11-16 by `05`: the header is the first section of the page's single panel and the tabs sit inside the same panel; the content is unchanged.) | O-10.1 |

| D-9 | **Rule 39ª (confirmed):** every admin-app role sees the real status and motive. The cashier app shows "En revisión" for any non-ACTIVO status. | O-10.2 |
| D-10 | **Catalogs come from the official Banxico and CNBV catalogs**, loaded as fixtures **without risk grades** (D-3). Catalogs with no official source keep the demo's values. The risk pill and risk tab stay hidden for now. | O-0.4 |
| D-11 | **Client detail tabs** (content per the lead's answers):<br>• **General:** completitud, datos, and for PM the **estructura accionaria** (accionistas)<br>• **Movimientos de efectivo** (renamed 2026-11-20, D-21): the client's **cash in/out ledger** (every amount per currency that entered or left for this client)<br>• **Representantes legales** (PM only): personas que pueden obligarla + quien comparece<br>• **Beneficiarios:** **propietarios reales** (PM: 25%+ or administrador; PF: the third party when acting on someone else's behalf)<br>• **Operaciones:** the compra/venta records<br>• **Documentos**<br>• **Declaración PEP**<br>• **Auditoría:** audit trail, mandatory on every detail view (`01`) | O-10.1 |
| D-13 | **Every detail view has an "Auditoría" tab** (rule in `01`). This brings **audit entries** back into scope, and they partly supersede D-5's "bitácora events out of scope": each record keeps its audit trail in NGXS (fixtures in Phase 1, written on every change made in the app). Alerts and "Aviso al Oficial" stay out of scope. | D-5 (partly) |
| D-14 | **Catalog keys: official CNBV/Banxico keys, verbatim.** Legal compliance is a main selling point of the demo. This applies to country keys too (`UK`, `EL`, … as published). Files: `plans/catalogos/`. | `catalogos/README` Para decidir 1 |
| D-15 | **Entidades (RENAPO letter keys for CURP):** the lead will provide the source later. Until then CURP's entidad check has no catalog. | Para decidir 2 |
| D-16 | **Foreign addresses get a localidad too:** the CNBV localidades catalog includes foreign places, so a foreign domicilio stores its localidad instead of null (this extends the demo). | Para decidir 3 |
| D-17 | **Actividad económica: one CNBV catalog for PF and PM, the same one onp-whitelabels uses** (`plans/catalogos/actividad-economica.json`, 1,263 entries, verbatim from onp's seed). It's a superset of the three official sheets. Replaces the demo's 26 risk-graded ocupaciones. | Para decidir 4 |
| D-18 | **Currencies: ISO 4217 keys** (revised 2026-11-13; was "Banxico keys"). Catalog: `plans/catalogos/divisas.json` (CNBV DE1, ISO). Banxico JSONs kept as reference only. | Para decidir 5 |
| D-19 | **Identification types: keep the demo's 13-item list** for now. The lead will review it with the product owner. | Para decidir 6 |
| D-20 | **The 2019 CNBV package is accepted for the demo.** | Para decidir 7 |
| D-21 | (lead, 2026-11-20) **Expediente level pills are neutral** for every level: the level is an attribute, not a judgment (replaces the demo's 1 neutral · 2 info · 3 ok, §10). The detail tab "Movimientos" is renamed **"Movimientos de efectivo"** so it doesn't clash with the Movimientos screen. | D-11, §10 |
| D-22 | (lead, 2026-11-20) **Amounts in the demo strings below render code-first** (`05` Money and dates): "{monto} USD" → `USD 1,000.00`. A missing client shows the shared `app-record-not-found` page (`01`), not "Usuario inexistente.". | §2, §10 |
| D-12 | **"Business" = the centro cambiario profile** (tenant config + branches), a new admin module. Tabs: **General · Legal · Auditoría** (audit trail). Branches live in this module too. See `00-master-plan.md`. | — |

## 0. How to read this spec

### 0.1 Source aliases (paths relative to `centro-cambiario-demo/src/app/`)
| Alias | File |
|---|---|
| `CCS` | `services/clientes/campos-cliente.service.ts` |
| `CS` | `services/clientes/clientes.service.ts` |
| `MS` | `services/catalogos/matriz.service.ts` |
| `CAT` | `services/catalogos/catalogos.service.ts` |
| `LS` | `services/listas/listas.service.ts` |
| `COI` | `services/listas/coincidencias.service.ts` |
| `PROV` | `services/listas/proveedores.service.ts` |
| `OPS` | `services/operaciones/operaciones.service.ts` |
| `PAR` | `services/parametros/parametros.service.ts` |
| `SEC` | `model/constants/secciones-cliente.const.ts` |
| `DOC` | `model/constants/documentos-cliente.const.ts` |
| `PERM` | `model/constants/permisos.const.ts` |
| `MOT` | `model/constants/motivos-aviso.const.ts` |
| `T-CLI` | `model/types/cliente.ts` |
| `FORM` | `modules/clientes/pages/cliente-formulario/cliente-formulario.{ts,html}` |
| `EXP` | `modules/clientes/pages/cliente-expediente/cliente-expediente.{ts,html}` |
| `LISTA` | `modules/clientes/pages/clientes-lista/clientes-lista.{ts,html}` |
| `cmp/<x>` | `modules/clientes/components/<x>/<x>.{ts,html}` |
| `SQL/nn` | `services/sql/scripts/nn-*.sql` |
| `PROTO` | `../CentroCambiario_Prototipo_v1.3_1.html` |

### 0.2 Demo roles and the permissions the expediente uses
Source: `PERM:4-23`. Demo roles: CAJERO, SUPERVISOR, OFICIAL_CUMPLIMIENTO (OC), ADMIN. The new app has only **SUPERADMIN** and **CAJERO**.

| Permission | Demo roles | Used for |
|---|---|---|
| `verClientes` | all four | list and expediente |
| `capturarClientes` | CAJERO, SUPERVISOR, OC | "+ Nuevo usuario", form, "Aviso al Oficial" |
| `verRiesgoDetalle` | SUPERVISOR, OC | risk points in the form bar, risk breakdown card |
| `verEstatusReal` | OC | real status (39ª), status motive, lists card, revision-dialog detail |
| `cambiarEstatus` | OC | "Cambiar estatus", editing a non-ACTIVO expediente |
| `asignarAntecedentes` | OC | editing the "Antecedentes" field |
| `verAlertas` | OC | alerts card |
| `dictaminarAlertas` | OC | list-hit dictamen, "Consultar en listas ahora" |
| `capturarOperaciones` | CAJERO, SUPERVISOR | "Nueva operación con este usuario" |
| `configurarMatriz`, `gestionarListas`, `gestionarCatalogos` | OC | config modules (dropped in the new app) |

### 0.3 Parameters the expediente reads (seed `SQL/02:16-24`, `SQL/04:44`)
| Clave | Valor | Comparador | Used by |
|---|---|---|---|
| `UMBRAL_NIVEL1_USD` | 1000 | `>=` | level by amount (§2) |
| `UMBRAL_NIVEL2_USD` | 3000 | `>=` | level by amount (§2) |
| `UMBRAL_NIVEL3_USD` | 5000 | `>=` | level by amount (§2) |
| `VIGENCIA_COMPROBANTE_DOMICILIO_MESES` | 3 | — | proof-of-address age (§4) |
| `EDAD_MINIMA_AVISO` | 18 | — | under-age warning (§3) |
| `ARCHIVO_TAMANO_MAX_KB` | 1500 | — | upload size (§4) |
| `LISTAS_SIMILITUD_MINIMA` | 0.6 | — | blacklist "posible" (§7) |
| `LISTAS_SIMILITUD_ALTA` | 0.85 | — | blacklist "coincidencia" (§7) |
| `PEP_NACIONAL_PERMANENCIA_ANIOS` | 1 | — | **not used anywhere** (§6) |
| `LIMITE_DIARIO_USD` | 10000 | `>` | expediente operations card (§10) |

### 0.4 Dependencies on modules the new app dropped
| Expediente feature | Depends on (dropped) | OPEN |
|---|---|---|
| Select options (países, ocupaciones, IDs…) and their risk grade | Catálogos | O-0.4 |
| Risk score (criteria, points, scales) | Parámetros → Matriz de riesgo | O-5.1 |
| Dynamic risk questions `crit_<codigo>` | Matriz de riesgo | O-3.1 |
| Blacklist check on save, list actions, providers | Listas negras | O-7.1, O-7.2, O-7.3 |
| Alerts created on save, aviso, risk change | Alertas PLD/FT | O-7.4, O-5.5, O-9.3 |
| Hit dictamen (homonimia / confirmada) | Alertas / Listas (OC) | O-7.5 |
| Thresholds and limits | Parámetros | O-0.3 |
| "Operado hoy" (daily accumulation) | Monitoreo | O-10.4 |

### 0.5 Cross-cutting OPEN
- **O-0.1 Role mapping.** The demo gates on 4 roles (table 0.2). Options: (a) SUPERADMIN gets every demo permission and CAJERO gets the demo CAJERO set; (b) SUPERADMIN gets every permission and CAJERO only views (no capture) until the cashier app; (c) a different split per permission. Each section repeats its own gating.
- **O-0.2 Copy term.** Since v1.11 the demo says "usuario" for the client in all copy (`SQL/14:1-7`). The new routes say `clientes`. Keep "usuario" in UI copy, or switch to "cliente"? Literal copy below keeps the demo's "usuario".
- **O-0.3 Parameters source.** Fixture constants, or a `parametros` NGXS slice seeded from a fixture? Read-only?
- **O-0.4 Catalogs source.** A typed fixture per catalog (§3.4 lists them)? The full ISO country list (≈250) and the one-row LOCALIDADES example come with the seed.
- **O-0.5 Bitácora.** The demo writes events (`CLIENTE_ALTA`, `CLIENTE_ACTUALIZADO`, `DOCUMENTO_CARGADO`, `CAMBIO_ESTATUS`, `AVISO_EMPLEADO`, `LISTA_COINCIDENCIA`, `RIESGO_POR_LISTA`, …). The admin app has a `bitacora` module. Emit these into its state, or skip?
- **O-0.6 History.** The demo never deletes: replaced persons, documents and identifications become `vigente = 0`, and propietario-real changes add rows. Keep history in NGXS, or overwrite in place?
- **O-0.7 App split.** Admin: full capture (SUPERADMIN). Cashier app: "clientes: list, register, detail" (master plan). Same form and rules in both? Can CAJERO capture later?
- **O-0.8 Fixture clients.** How many, and which scenarios (PF/PM, each level, MEDIO/ALTO, PEP, SUSPENDIDO/BLOQUEADO, list hits)?

---

## 1. Persona física / persona moral split

### Behavior
- Every client is `PF` (persona física) or `PM` (persona moral). The type is chosen **only on create**. A saved expediente never changes type (`FORM:184-190`).
- On create, the form shows a "Tipo de persona" card with two radios, "Persona física" / "Persona moral". Default `PF`.
- Switching type on create keeps a draft per type: going PF → PM → PF restores what was typed for PF (`FORM:65, 186-189`). Errors are hidden again on switch.
- The type drives: sections (`CCS:325-327`), fields (`CCS:316-322`, a field without `persona` applies to both), documents (`CCS:344-354`), level titles (`cmp/nivel-selector:27-29`), duplicate rules (§8), list-check scope (§7), RFC rules and the expediente's data grid (§10).
- Helpers (`utils/cliente.ts`):

| Helper | Rule |
|---|---|
| `tipoPersona(d)` | `'PM'` if `d.tipo_persona === 'PM'`, else `'PF'` |
| `esMX(d)` | `(d.nacionalidad \|\| 'MX') === 'MX'`. For PM it's the company's nationality |
| `esExtranjero(d)` | `!esMX(d)` |
| `esVisitante(d)` | foreign and `condicion_estancia === 'VISITANTE'` |
| `esResidenteExt(d)` | foreign and `condicion_estancia` set and ≠ `VISITANTE` (includes `DIPLOMATICO`) |
| `domicilioMX(d)` | `(d.dom_pais \|\| 'MX') === 'MX'` |
| `vacio(v)` | `undefined`, `null`, `''`, `false` or `[]` |
| `nombreCompleto(x)` | `denominacion` if present, else `nombres apellido_paterno apellido_materno` joined, skipping blanks |

| Aspect | PF | PM |
|---|---|---|
| Name | nombres + apellidos (one apellido required) | denominación o razón social |
| Key date | fecha_nacimiento | fecha_constitucion |
| Identifier | CURP (MX, level 3), RFC 13 (optional) | RFC 12 (required if MX nationality) |
| Who shows ID | the client | "quien comparece" |
| Linked persons | propietario real (only if acting for a third party) | quien comparece, representantes, accionistas, propietarios reales |
| PEP section | yes | no |
| Declaración cuenta propia | yes | no |
| Level titles | 1 "Datos básicos", 2 "+ Copia de identificación", 3 "Expediente completo" | 1 "Datos de la persona moral", 2 "+ Identificación de quien comparece", 3 "Expediente completo y propietarios reales" |
| Same level thresholds | yes | yes (`SQL/15:6`) |

### Data
| Table (demo) | Holds |
|---|---|
| `clientes` | common: id, numero_cliente, tipo_persona (`PF`/`PM`/`FI`), nivel_expediente (1–3), nacionalidad, rfc, serie_firma_electronica, domicilio, domicilio MX, telefono, email, antecedentes, risk, PEP, perfil, cuestionario, doc exemptions, declaración, estatus, motivo_estatus, creado_por/en, actualizado_en (`SQL/03:135-170`, + `perfil_divisas` `SQL/04:12`) |
| `clientes_pf` | nombres, apellido_paterno, apellido_materno, nombre_normalizado, genero (`H/M/X`), fecha_nacimiento, pais_nacimiento, entidad_nacimiento, curp (unique), ocupacion, actividad_detalle, condicion_estancia (`NACIONAL` + 4) (`SQL/03:192-208`) |
| `clientes_pm` | denominacion, nombre_normalizado, giro, fecha_constitucion, telefono_adicional, reciente_constitucion, estructura_corporativa (`SQL/15:10-19`) |
| `cliente_identificaciones` | PF ID history: tipo, numero, pais_emision, fecha_vencimiento; unique (tipo, numero) (`SQL/03:215-223`) |
| `cliente_personas` | PM linked persons by rol (`COMPARECIENTE`, `REPRESENTANTE`, `ACCIONISTA`, `PROPIETARIO_REAL`), with `clave`, `orden`, `vigente` (`SQL/15:27-50`) |
| `cliente_propietarios_reales` | PF third-party beneficial owner history (`SQL/01:175-185`) |
| `v_clientes` | list view: nombre_completo = denominación or full name; nombre_normalizado; fecha_nacimiento / fecha_constitucion; curp; rfc (`SQL/15:82-93`) |

- The form works on one flat record `DatosCliente = Record<string, any>` keyed by field id, plus work keys `__docs` (documents by key) and `__riesgo` (estimated grade) (`T-CLI:33-36`).
- `nombre_normalizado` = `normalizarNombre(nombre)`: strip accents, uppercase, non-alphanumerics → space, collapse spaces (`utils/similitud.ts:2-7`).
- Clients are never deleted (trigger `SQL/03:237-238`).

### UI
- Create: "Tipo de persona" card above the level selector (`FORM html:8-16`).
- Edit: no type card. A line instead: "Usuario **{numero}** · {nombre} · Persona moral|Persona física" (`FORM html:4-6`).

### Demo source
`FORM:65, 81, 184-190`; `CCS:316-327, 344-354`; `utils/cliente.ts:5-26`; `SQL/03:135-208`; `SQL/15:10-93`.

### OPEN
- **O-1.1** The schema allows `tipo_persona = 'FI'` (fideicomiso?) but nothing uses it. Include it, or PF/PM only?
- **O-1.2** Keep the per-type draft when switching type on create?
- **O-1.3** Model shape: one flat record keyed by field id (demo), or typed `ClientePF` / `ClientePM` interfaces?

---

## 2. Expediente niveles 1–3

### Behavior

**What each level requires** (detail in §3 and §4):

| Level | PF adds | PM adds |
|---|---|---|
| 1 | identidad (names, birth date, birth country, nationality, condición de estancia if foreign), identificación, domicilio, antecedentes | datos PM, domicilio, contacto, representantes (≥1), quien comparece, identificación de quien comparece, accionistas (≥1), estructura corporativa (if risk ≠ BAJO), antecedentes |
| 2 | "Copias de documentos" section opens: copy of the ID | copy of quien comparece's ID |
| 3 | género, entidad de nacimiento (born MX), CURP (MX) become required; RFC/e.firma (optional); ocupación; localidad; domicilio en México (foreign domicile, optional block); contacto; doc exemptions; PEP; perfil transaccional; declaración (+ propietario real if third party); cuestionario (if ALTO); docs: constancia CURP, comprobante de domicilio, documento migratorio | propietarios reales; perfil transaccional; localidad; "reciente constitución" flag; cuestionario (if ALTO); docs: acta, escrito de compromiso, cédula fiscal, FIEL, comprobante, poder, declaración de propietarios, poder + ID per representative |

**Visibility rule.** A field shows when `campo.nivel <= nivelElegido` **and** its `ver(d)` is true **and** its section is visible. A section is visible when `seccion.nivel` is unset or `<= nivelElegido`, **and** its `ver(d)` is true (`CCS:333-340`). A section's "Nivel N" badge appears when the section has a `nivel` (`FORM html:27-29`).

**Level selector** (`cmp/nivel-selector`, `FORM:157-171`):
- Initial level = `min(3, max(nivel_expediente ?? 1, 1, ?nivel query param))`.
- Three buttons set the level to 1, 2 or 3. **The buttons do not enforce the minimum**: the user can click a level below the current one (same in `PROTO:3662`).
- "Calcular nivel" converts a USD amount: `n = nivelPorMonto(m)`; level = `max(n, 1, minimo)`, where `minimo` = the stored `nivel_expediente`. **Only the calculator respects "never lower".** Input parsing strips `,`, `$` and spaces; `!(m > 0)` → "Capture un monto válido."
- `nivelPorMonto(usd)`: `usd >= 5000` → 3; `>= 3000` → 2; `>= 1000` → 1; else 0 (comparators from the parameters) (`PAR:136-141`).
- Calculator messages:
  - n = 0, PF: "Menos de {u1} USD: la DCG no exige expediente; se registra con datos básicos (nivel 1)."
  - n = 0, PM: "Menos de {u1} USD: la 4ª no exige expediente; aplique lo que establezca el Manual de Cumplimiento (aquí se registra con los datos del nivel 1)."
  - else: "{monto} USD requiere nivel {n}."

**Stored level is computed, not chosen.** On save, validation runs only for the **chosen** level (`CS:288`). After writing, the stored level = `max(evaluar(datos).alcanzado, 1)` (`CS:455-456`). So choosing a lower level doesn't lower a complete expediente; it drops only if data no longer passes.

**Completeness evaluation** `evaluar(d)` (`CCS:404-438`):
1. Run `validar(d, n)` for n = 1, 2, 3 → `err[n]`.
2. For each field: find the **first** level n where it is visible and required. List it under that level as `{etiqueta, ok: !err[n][id], error}`.
3. For each document that `documentoRequerido` says applies: list it under `doc.nivel`.
4. Any other error at a level (an optional field filled with invalid data, e.g. a wrong RFC) is appended as "{etiqueta} (dato inválido)".
5. `completo(n)` = `err[n]` is empty. `alcanzado` = 3 if completo(3), else 2 if completo(2), else 1 if completo(1), else 0.

**Validation pipeline** `validar(d, n)` (`CCS:370-400`): for each **visible** field: empty and `req(d, n)` → "Dato obligatorio para este nivel."; non-empty → `validar(v, d)` error and `aviso(v, d)` warning. Then documents (§4). Warnings never block.

**Per-level operation limits** (coupling to operaciones, `OPS:94, 111-131`):
| Op amount (USD equiv.) | Required level |
|---|---|
| < 1,000 | 0 (no expediente; occasional client allowed) |
| ≥ 1,000 and < 3,000 | 1 |
| ≥ 3,000 and < 5,000 | 2 |
| ≥ 5,000 | 3 |
- Op blocked if `nivel_expediente < required`: "El expediente del usuario es nivel {n}; esta operación requiere nivel {req}."
- Op blocked if required > 0 and the ID expired: "La identificación del usuario venció el {fecha}. Actualice el expediente con una identificación vigente."
- Independent of level: daily cap `LIMITE_DIARIO_USD` 10,000 per client.
- The expediente header states what the stored level allows (`EXP:72-77`):
  - 0: "No puede operar desde 1,000 USD"
  - 1: "Puede operar montos menores a {u2} USD"
  - 2: "Puede operar montos menores a {u3} USD"
  - 3: "Puede operar cualquier monto"

### Data
- `clientes.nivel_expediente` INTEGER 1–3 (stored, computed on save).
- `EvaluacionExpediente = { niveles: {1|2|3: { items: {etiqueta, ok, error?}[], completo }}, alcanzado: 0–3 }` (`T-CLI:130-139`).
- Field definition: `{ id, seccion, etiqueta, persona?, nivel, req(d, n), ver?(d), tipo, opciones?(d), inicial?, mayus?, ancho?, max?, digitos?, nota?, validar?, aviso?, soloLectura?, columnas?, proponer? }` (`T-CLI:82-105`).

### UI
- Selector card: "Nivel de expediente" + "Depende del monto de la operación que realizará el usuario (4ª). Puede subir de nivel después."
- Buttons: "Nivel 1 · {título}" / "Operaciones desde {u1} y menores a {u2} USD"; "Nivel 2 · {título}" / "Desde {u2} y menores a {u3} USD"; "Nivel 3 · {título}" / "Desde {u3} USD". The active one is highlighted.
- Calculator: label "¿O calcular por monto? (USD)", placeholder "p. ej. 4500", button "Calcular nivel", result text beside it. Enter key triggers it.
- Sticky action bar: "{n} pendiente(s) para nivel {N}" (warn) or "Completo para nivel {N}" (ok). n = count of validation errors at the chosen level.
- Completeness card on the expediente (§10).

### Demo source
`cmp/nivel-selector:16-46` + html; `FORM:157-171`; `FORM html:51-66`; `CCS:333-340, 370-438`; `CS:455-456`; `PAR:129-141`; `OPS:94, 111-131`; `EXP:72-77`; `PROTO:3662-3672`.

### OPEN
- **O-2.1** Level buttons allow a level below the current one; only the calculator and initial value respect the minimum. Enforce the minimum on the buttons too?
- **O-2.2** The stored level and the live evaluation drift apart over time (ID expires, comprobante ages past 3 months). Which one drives the badge and list? Recompute on load?
- **O-2.3** The header text for level 0 exists, but the stored level is never below 1. Keep the level-0 case?
- **O-2.4** Op-side rules (required level, ID vigente, daily cap) belong to the operaciones spec (`02`). Confirm the same thresholds, and where they come from (O-0.3).
- **O-2.5** The form accepts `?nivel=` (minimum level) and `?volver=` (return to Nueva operación with `?cliente=<id>`). Keep this for the cashier app?
- **O-2.6** "No puede operar desde 1,000 USD" hard-codes 1,000 instead of `UMBRAL_NIVEL1_USD`. Keep or bind?

---

## 3. Sections and fields

### Behavior

#### 3.1 Sections (`SEC:5-34`), in render order
| # | id | Título | Persona | Nivel | Visible when | Ayuda (literal) |
|---|---|---|---|---|---|---|
| 1 | `identidad` | Datos de identificación | PF | — | always | Nombre completo sin abreviaturas, como aparece en la identificación (4ª fr. I y III). |
| 2 | `identificacion` | Identificación oficial | PF | — | always | Debe ser original, vigente, con fotografía y firma (4ª fr. III, A, b) i.). |
| 3 | `domicilio` | Domicilio particular | PF | — | always | Domicilio en su lugar de residencia (4ª fr. I, A, v.). |
| 4 | `domicilio_mx` | Domicilio en México | PF | 3 | `dom_pais ≠ MX` | Solo si el usuario reside en el extranjero y tiene domicilio en territorio nacional. |
| 5 | `contacto` | Contacto | PF | 3 | always | — |
| 6 | `pm_datos` | Datos de la persona moral | PM | — | always | Denominación o razón social completa, como aparece en el acta constitutiva (4ª fr. II). |
| 7 | `domicilio` | Domicilio | PM | — | always | Domicilio de la persona moral. |
| 8 | `pm_contacto` | Contacto | PM | — | always | — |
| 9 | `pm_representantes` | Personas que pueden obligarla | PM | — | always | Administradores, director, gerente o apoderados que pueden obligar a la persona moral. Desde nivel 3 se carga el poder y la identificación de cada uno. |
| 10 | `pm_comparece` | Persona física que comparece | PM | — | always | Quien acude en representación de la persona moral. Desde nivel 2 se recaba copia de su identificación oficial; en nivel 3, también su poder. |
| 11 | `identificacion` | Identificación de quien comparece | PM | — | always | Original, vigente, con fotografía y firma. |
| 12 | `pm_accionistas` | Estructura accionaria | PM | — | always | Accionistas o socios y su participación. Si el riesgo estimado no es bajo, describa también la estructura corporativa interna. |
| 13 | `documentos` | Copias de documentos | both | 2 | always | Digitalice copia simple legible y coteje contra el original que tiene a la vista. |
| 14 | `pm_propietarios` | Propietarios reales | PM | 3 | always | Según la declaración del representante: quienes tienen una participación de 25% o más; en su defecto, el administrador. |
| 15 | `pep` | Persona Políticamente Expuesta | PF | 3 | always | 2ª fr. XXI. Incluye al cónyuge, concubino y parientes hasta segundo grado. |
| 16 | `perfil` | Perfil transaccional | both | 3 | always | Lo que el usuario declara que operará normalmente (14ª). |
| 17 | `declaracion` | Declaración de actuar por cuenta propia | PF | 3 | always | 4ª fr. III, A, b) iv. Queda registrada electrónicamente con fecha y hora. |
| 18 | `riesgo` | Antecedentes y criterios adicionales de riesgo | both | — | always | Criterios de la matriz de riesgo que configura el Oficial de Cumplimiento (15ª). Los antecedentes solo los asigna el Oficial. |
| 19 | `cuestionario` | Cuestionario de alto riesgo | both | 3 | `__riesgo === 'ALTO'` | 15ª: el usuario es de grado de riesgo ALTO; se requiere información adicional con su consentimiento expreso. |

#### 3.2 Field inventory
Legend:
- **Req:** "siempre" = always when visible; "nunca" = optional; otherwise the condition (`n` = chosen level).
- **Tipo:** `texto`, `fecha` (DD/MM/AAAA, stored ISO), `numero`, `select`, `casilla` (checkbox), `multi`, `radio`, `textarea`, `tabla`.
- **MAYÚS:** uppercases as typed. **dígitos:** strips non-digits. `max` = maxlength.
- **Ancho:** grid width `a1`–`a6` (6-column grid).
- All text values are trimmed. Shared messages: `SINABR` = "Sin abreviaturas." (rejects any `.`); `FPASADA` = "Fecha inválida." / "No puede ser una fecha futura.".

**Identidad (PF)** (`CCS:98-128`)
| id | Etiqueta | Niv | Tipo | Ancho | Req | Visible | Validación / aviso / nota | Opciones |
|---|---|---|---|---|---|---|---|---|
| `nombres` | Nombre(s) | 1 | texto MAYÚS | a2 | siempre | — | contains `.` → "Sin abreviaturas: escriba el nombre completo (p. ej. MARÍA, no MA.)." | — |
| `apellido_paterno` | Apellido paterno | 1 | texto MAYÚS | a2 | if `apellido_materno` empty | — | SINABR · nota "Al menos un apellido" | — |
| `apellido_materno` | Apellido materno | 1 | texto MAYÚS | a2 | if `apellido_paterno` empty | — | SINABR | — |
| `fecha_nacimiento` | Fecha de nacimiento | 1 | fecha | a2 | siempre | — | "Fecha inválida." / "No puede ser una fecha futura." / age > 120 → "Revise el año de nacimiento." · **aviso** age < `EDAD_MINIMA_AVISO` (18) → "El usuario tiene {edad} años." | — |
| `pais_nacimiento` | País de nacimiento | 1 | select | a2 | siempre | — | — | PAISES, inicial `MX` |
| `nacionalidad` | Nacionalidad | 1 | select | a2 | siempre | — | — | PAISES, inicial `MX` |
| `condicion_estancia` | Condición de estancia en México | 1 | select | a3 | siempre | nacionalidad ≠ MX | saved as `NACIONAL` when MX | `RESIDENTE_TEMPORAL` Residente temporal · `RESIDENTE_PERMANENTE` Residente permanente · `DIPLOMATICO` Representante diplomático o consular · `VISITANTE` Visitante / turista (no residente) |
| `genero` | Género | 1 | select | a1 | `n >= 3` | — | — | `H` Hombre · `M` Mujer · `X` No binario |
| `entidad_nacimiento` | Entidad de nacimiento | 1 | select | a3 | `n >= 3` | pais_nacimiento = MX (or empty) | saved as `NE` when born abroad | ENTIDADES without `NE` |
| `curp` | CURP | 1 | texto MAYÚS max 18 | a2 | `n >= 3` and esMX | — | `CURP.validar` (§3.5) · **aviso** first 4 chars ≠ generated → "Las letras de la CURP no corresponden al nombre capturado (se esperaba {XXXX}); revise." · nota (static) "Se genera sola con los datos anteriores; compárela con la identificación", replaced by the dynamic note (§3.5) | — |
| `rfc` | RFC con homoclave | 3 | texto MAYÚS max 13 | a2 | nunca | — | `validarRFC` (§3.5) · **aviso** CURP set, len ≥ 10 and first 10 ≠ CURP's → "Los primeros 10 caracteres del RFC normalmente coinciden con la CURP: revise." · nota "Cuando disponga de él" · placeholder "{CURP[0..10]} + homoclave" when CURP ≥ 10 chars | — |
| `serie_firma_electronica` | No. de serie de e.firma | 3 | texto | a2 | nunca | — | nota "Cuando cuente con ella" | — |
| `ocupacion` | Ocupación, profesión o actividad | 3 | select | a3 | siempre | — | — | OCUPACIONES |
| `actividad_detalle` | Detalle de la actividad | 3 | texto | a3 | if `ocupacion = OTRA` | always at level 3 | — | — |

**Datos de la persona moral (PM)** (`CCS:131-139`)
| id | Etiqueta | Niv | Tipo | Ancho | Req | Validación / aviso / nota | Opciones |
|---|---|---|---|---|---|---|---|
| `denominacion` | Denominación o razón social | 1 | texto MAYÚS | a4 | siempre | nota "Completa, con el régimen societario (p. ej. S.A. DE C.V.)" (no abbreviation check) | — |
| `nacionalidad` | Nacionalidad | 1 | select | a2 | siempre | — | PAISES, inicial `MX` |
| `giro` | Giro mercantil, actividad u objeto social | 1 | texto | a6 | siempre | — | — |
| `fecha_constitucion` | Fecha de constitución | 1 | fecha | a2 | siempre | FPASADA | — |
| `rfc` | RFC con homoclave | 1 | texto MAYÚS max 12 | a2 | if esMX (company nationality) | `validarRFCMoral` (§3.5) · nota "12 caracteres. Si es extranjera, cuando cuente con él" | — |
| `serie_firma_electronica` | No. de serie de la FIEL (e.firma) | 1 | texto dígitos max 20 | a2 | nunca | **aviso** length ≠ 20 → "El número de serie de la FIEL normalmente tiene 20 dígitos: revise." · nota "Cuando cuente con ella" | — |

**Identificación (both; PM = quien comparece)** (`CCS:142-149`)
| id | Etiqueta | Niv | Tipo | Ancho | Req | Visible | Validación / nota | Opciones |
|---|---|---|---|---|---|---|---|---|
| `tipo_identificacion` | Tipo de identificación | 1 | select | a3 | siempre | — | — | TIPOS_IDENTIFICACION filtered (below) |
| `numero_identificacion` | Número de identificación | 1 | texto MAYÚS | a3 | siempre | — | nota "En la INE, el número de la credencial (OCR / CIC)" | — |
| `pais_emision` | País que la expidió | 1 | select | a3 | siempre | tipo = `PASAPORTE` | — | PAISES (no default) |
| `fecha_vencimiento_id` | Vigencia (vence el) | 1 | fecha | a3 | siempre | tipo `requiere_vigencia` | "Fecha inválida." / past → "La identificación está vencida: debe estar vigente." | — |

ID type filter (`CCS:85-89`):
- PF visitante → only `PASAPORTE`.
- Otherwise "mexican" = PM ? `(rep_nacionalidad || 'MX') === 'MX'` : esMX. Mexican → types with `nacionales = 1`; else types with `extranjeros = 1`.
- When the chosen option disappears (e.g. nationality changed), the value is cleared (`FORM:174-181`; applies to every select).
- On save, `pais_emision` = the captured value if PASAPORTE, else `MX` if mexican, else null (`CS:392-393`).

**Domicilio (both)** (`CCS:152-165`)
| id | Etiqueta | Niv | Tipo | Ancho | Req | Visible | Validación / nota | Opciones |
|---|---|---|---|---|---|---|---|---|
| `dom_pais` | País del domicilio | 1 | select | a2 | siempre | — | — | PAISES, inicial `MX` |
| `dom_codigo_postal` | Código postal | 1 | texto max 10 | a1 | if domicilioMX | — | MX and not `^\d{5}$` → "Debe tener 5 dígitos." | — |
| `dom_entidad` | Entidad federativa / estado | 1 | select if MX, else texto | a3 | if domicilioMX | — | — | ENTIDADES without `NE` |
| `dom_calle` | Calle, avenida o vía | 1 | texto | a4 | siempre | — | — | — |
| `dom_numero_exterior` | Núm. exterior | 1 | texto | a1 | siempre | — | — | — |
| `dom_numero_interior` | Núm. interior | 1 | texto | a1 | nunca | — | — | — |
| `dom_colonia` | Colonia o urbanización | 1 | texto | a2 | if domicilioMX | — | — | — |
| `dom_municipio` | Alcaldía o municipio | 1 | texto | a2 | if domicilioMX | — | — | — |
| `dom_ciudad` | Ciudad o población | 1 | texto | a2 | if **not** domicilioMX | always | — | — |
| `dom_localidad` | Localidad (catálogo de la autoridad) | 3 | select | a3 | if domicilioMX and options exist | domicilioMX | nota "Se usa en los reportes oficiales (columna 26)" · saved null if not MX | LOCALIDADES where `attr.entidad` empty or = `dom_entidad` |

**Domicilio en México (PF, section level 3, only if `dom_pais ≠ MX`)** (`CCS:168-174`)
| id | Etiqueta | Niv | Tipo | Ancho | Req | Validación | Opciones |
|---|---|---|---|---|---|---|---|
| `dom_mx_calle` | Calle y número | 3 | texto | a4 | nunca | — | — |
| `dom_mx_numero_exterior` | Núm. exterior | 3 | texto | a2 | if `dom_mx_calle` | — | — |
| `dom_mx_colonia` | Colonia | 3 | texto | a2 | if `dom_mx_calle` | — | — |
| `dom_mx_municipio` | Alcaldía o municipio | 3 | texto | a2 | if `dom_mx_calle` | — | — |
| `dom_mx_entidad` | Entidad federativa | 3 | select | a2 | if `dom_mx_calle` | — | ENTIDADES without `NE` |
| `dom_mx_codigo_postal` | Código postal | 3 | texto | a1 | if `dom_mx_calle` | "Debe tener 5 dígitos." | — |

**Contacto** (`CCS:177-184`)
| id | Etiqueta | Persona | Niv | Tipo | Ancho | Req | Validación / nota |
|---|---|---|---|---|---|---|---|
| `telefono` | Teléfono | PF | 3 | texto dígitos max 10 | a2 | siempre | "El teléfono debe tener exactamente 10 dígitos." · nota "10 dígitos, sin espacios ni guiones." |
| `email` | Correo electrónico | PF | 3 | texto | a3 | nunca | regex `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` → "Correo electrónico inválido." |
| `telefono` | Teléfono | PM | 1 | texto dígitos max 10 | a2 | siempre | same as PF |
| `telefono_adicional` | Otro teléfono | PM | 1 | texto dígitos max 10 | a2 | nunca | same phone rule |
| `email` | Correo electrónico | PM | 1 | texto | a2 | nunca | same email rule |

**Persona física que comparece (PM)** (`CCS:202-216`)
| id | Etiqueta | Niv | Tipo | Ancho | Req | Validación / nota | Opciones |
|---|---|---|---|---|---|---|---|
| `rep_nombres` | Nombre(s) | 1 | texto MAYÚS | a2 | siempre | SINABR; if a representative row is marked `comparece` and its normalized full name ≠ this person's → "No coincide con {nombre}, marcado en la lista como quien comparece." | — |
| `rep_apellido_paterno` | Apellido paterno | 1 | texto MAYÚS | a2 | if materno empty | SINABR · nota "Al menos un apellido" | — |
| `rep_apellido_materno` | Apellido materno | 1 | texto MAYÚS | a2 | if paterno empty | SINABR | — |
| `rep_cargo` | Carácter con que comparece | 1 | texto | a2 | siempre | nota "P. ej. apoderado legal, administrador único" | — |
| `rep_nacionalidad` | Nacionalidad | 1 | select | a2 | siempre | drives the ID-type filter | PAISES, inicial `MX` |
| `rep_fecha_nacimiento` | Fecha de nacimiento | 1 | fecha | a2 | nunca | FPASADA · nota "Mejora la búsqueda en listas" | — |

Sync rule (`FORM:196-203`): whenever `representantes` changes and a row has `comparece = true`, the form **overwrites** `rep_nombres`, `rep_apellido_paterno`, `rep_apellido_materno` with that row's values, and `rep_cargo` with the row's cargo label (or keeps the current value if the row has no cargo).

**Estructura accionaria (PM)** (`CCS:219-242`): `accionistas` (table, §3.3) and:
| id | Etiqueta | Niv | Tipo | Ancho | Req | Visible | Nota |
|---|---|---|---|---|---|---|---|
| `estructura_corporativa` | Estructura corporativa interna | 1 | textarea | a6 | siempre | `__riesgo` set and ≠ `BAJO` | "Órganos de administración, áreas y quién decide: se recaba porque el riesgo no es bajo" |

**Documentos: exemption flags** (`CCS:245-251`; section is level 2, these fields are level 3)
| id | Etiqueta (literal) | Persona | Niv | Tipo | Req | Visible | Effect |
|---|---|---|---|---|---|---|---|
| `doc_curp_en_identificacion` | La CURP aparece impresa en la identificación (no se requiere la constancia de CURP) | PF | 3 | casilla | nunca | esMX | waives CONSTANCIA_CURP |
| `doc_domicilio_coincide` | El domicilio manifestado coincide con el de la identificación (no se requiere comprobante) | PF | 3 | casilla | nunca | ID type `incluye_domicilio` | waives COMPROBANTE_DOMICILIO (PF) |
| `reciente_constitucion` | Es de reciente constitución: el acta aún no está inscrita en el Registro Público (se recaba el escrito de compromiso) | PM | 3 | casilla | nunca | always | requires ESCRITO_COMPROMISO, renames the acta |

**PEP (PF, level 3)**: see §6 for the full table.

**Perfil transaccional (both, level 3)** (`CCS:282-291`)
| id | Etiqueta | Tipo | Ancho | Req | Validación / nota | Opciones |
|---|---|---|---|---|---|---|
| `perfil_monto_mensual_usd` | Monto mensual estimado (USD) | numero | a2 | siempre | `!(Number(v) > 0)` → "Capture un monto mayor a cero." | — |
| `perfil_num_operaciones_mes` | Operaciones al mes (aprox.) | numero | a2 | siempre | not an integer ≥ 1 → "Capture un número entero mayor a cero." | — |
| `perfil_origen_recursos` | Origen de los recursos | select | a3 | siempre | nota "Si al operar manifiesta otro, se genera una alerta de operación inusual" | ORIGEN_RECURSOS |
| `perfil_divisas` | Divisas que operará | multi | a6 | siempre | nota "Si opera una divisa no declarada se genera una alerta de operación inusual" · stored as comma-separated claves in catalog order | DIVISAS |
| `perfil_destino_recursos` | Destino de los recursos | select | a3 | siempre | same nota as origen | DESTINO_RECURSOS |

**Declaración (PF, level 3)** (`CCS:294-302`). Visible "tercero" = `actua_cuenta_propia === '0'`.
| id | Etiqueta | Tipo | Ancho | Req | Visible | Validación | Opciones |
|---|---|---|---|---|---|---|---|
| `actua_cuenta_propia` | El usuario declara que actúa | radio | a6 | siempre | — | — | `1` A nombre y por cuenta propia · `0` Por cuenta de un tercero |
| `pr_nombres` | Propietario real · nombre(s) | texto MAYÚS | a2 | siempre | tercero | — | — |
| `pr_apellido_paterno` | Apellido paterno | texto MAYÚS | a2 | if materno empty | tercero | — | — |
| `pr_apellido_materno` | Apellido materno | texto MAYÚS | a2 | if paterno empty | tercero | — | — |
| `pr_fecha_nacimiento` | Fecha de nacimiento | fecha | a2 | siempre | tercero | invalid or future → "Fecha inválida." | — |
| `pr_nacionalidad` | Nacionalidad | select | a2 | siempre | tercero | — | PAISES, inicial `MX` |
| `pr_relacion` | Relación con el usuario | texto | a2 | siempre | tercero | — | — |
- `declaracion_fecha` = now on the first save with a value; kept afterwards (`CS:357`). The detail shows "Por cuenta propia ({fecha hora})".
- The PF propietario real is stored as a new `cliente_propietarios_reales` row only when it differs from the latest (`CS:410-419`).

**Riesgo (both, no level)** (`CCS:305-306, 316-322`)
| id | Etiqueta | Niv | Tipo | Ancho | Req | Notes | Opciones |
|---|---|---|---|---|---|---|---|
| `antecedentes` | Antecedentes del usuario | 1 | select | a6 | siempre | inicial `1`. **Read-only unless `asignarAntecedentes` (OC).** On save, roles without it keep the previous value (or `1`) (`CS:319-321`) | ANTECEDENTES |
| `crit_<codigo>` | `pregunta` or `nombre` of the criterion | criterion `nivel` | select | a3 | if criterion `obligatorio` | one per **active** matrix criterion **without** `campo_cliente`. Stored in `cliente_criterios`. **The seed has none.** | the criterion's catalog |

**Cuestionario de alto riesgo (both, section level 3, only if `__riesgo = ALTO`)** (`CCS:309-312`)
| id | Etiqueta | Tipo | Ancho | Req |
|---|---|---|---|---|
| `cuestionario_actividad` | Describa su actividad preponderante y fuente de ingresos | textarea | a6 | siempre |
| `cuestionario_origen` | Origen detallado de los recursos que operará | textarea | a3 | siempre |
| `cuestionario_destino` | Destino detallado de los recursos | textarea | a3 | siempre |
| `cuestionario_consentimiento` | El usuario proporcionó esta información y otorga su consentimiento expreso | casilla | a6 | siempre (must be checked) |
- `cuestionario_fecha` = now on the first save with consent checked; kept afterwards (`CS:354`).

#### 3.3 Table fields
Common table behavior (`cmp/campo-tabla`, `CCS:448-452, 472-482`):
- Each row has a hidden `clave` (random 8-char id, `nuevaClave()`). Documents of a representative are keyed by it.
- New row = column `inicial` values (casilla → `false`, else `''`).
- Row validation returns the **first** error, as "Fila {i}: {error}.":
  1. empty `nombres` → "capture el nombre" (PM row: "capture la denominación")
  2. PF row with no apellido → "capture al menos un apellido"
  3. PF row with `.` in any name part → "sin abreviaturas"
  4. the table's extra check
- A column with `ver(f) = false` renders "—" and is not asked.
- Text columns marked MAYÚS uppercase as typed. Numbers accept `%`, `,` and spaces, which are stripped when parsed.

**`representantes`** · "Administradores, director, gerente o apoderados" · PM · level 1 · req siempre (≥ 1 row) · a6 (`CCS:187-199`)
| Col | Etiqueta | Tipo | Opciones / rule |
|---|---|---|---|
| `nombres` | Nombre(s) | texto MAYÚS | — |
| `apellido_paterno` | Apellido paterno | texto MAYÚS | — |
| `apellido_materno` | Apellido materno | texto MAYÚS | — |
| `cargo` | Cargo | select | `ADMINISTRADOR_UNICO` Administrador único · `CONSEJERO` Miembro del consejo de administración · `DIRECTOR` Director general · `GERENTE` Gerente · `APODERADO` Apoderado (`CCS:28-34`) |
| `comparece` | Es quien comparece | casilla | — |
- Extra checks: no cargo → "elija el cargo". More than one `comparece` → "Marque como quien comparece a una sola persona."

**`accionistas`** · "Accionistas o socios" · PM · level 1 · req siempre (≥ 1 row) · a6 (`CCS:219-240`)
| Col | Etiqueta | Tipo | Visible | Opciones / inicial |
|---|---|---|---|---|
| `tipo_persona` | Tipo | select | — | `PF` Persona física · `PM` Persona moral; inicial `PF` |
| `nombres` | Nombre(s) o denominación | texto MAYÚS | — | — |
| `apellido_paterno` | Apellido paterno | texto MAYÚS | row not PM | — |
| `apellido_materno` | Apellido materno | texto MAYÚS | row not PM | — |
| `nacionalidad` | Nacionalidad | select | — | PAISES; inicial `MX` |
| `participacion` | Participación (%) | numero | — | — |
- Row checks: no nacionalidad → "elija la nacionalidad"; participación not in (0, 100] → "la participación debe ser mayor a 0 y hasta 100%".
- Table error: Σ participación > 100.0001 → "Las participaciones suman {total}%: no pueden pasar de 100%."
- Table **aviso**: 0 < Σ < 99.9999 → "Las participaciones suman {total}%: revise si falta algún accionista."

**`propietarios_reales`** · "Propietarios reales" · PM · level 3 · req siempre (≥ 1 row) · a6 (`CCS:254-270, 456-501`)
| Col | Etiqueta | Tipo | Visible | Opciones / inicial |
|---|---|---|---|---|
| `criterio` | Se identifica por | select | — | `PARTICIPACION` Participación de 25% o más · `ADMINISTRADOR` Administrador (nadie tiene 25% o más); inicial `PARTICIPACION` |
| `nombres` | Nombre(s) | texto MAYÚS | — | — |
| `apellido_paterno` | Apellido paterno | texto MAYÚS | — | — |
| `apellido_materno` | Apellido materno | texto MAYÚS | — | — |
| `fecha_nacimiento` | Fecha de nacimiento | fecha | — | — |
| `nacionalidad` | Nacionalidad | select | — | PAISES; inicial `MX` |
| `participacion` | Participación (%) | numero | criterio ≠ ADMINISTRADOR | saved empty for ADMINISTRADOR |
- Row checks, in order:
  - no criterio → "indique por qué se identifica"
  - invalid or future birth date → "capture una fecha de nacimiento válida"
  - no nacionalidad → "elija la nacionalidad"
  - PARTICIPACION with % not in [25, 100] → "la participación de un propietario real es de 25% a 100%"
- "Mayores" = PF shareholders (`tipo_persona ≠ PM`) with participación ≥ 25.
- Table checks:
  - a mayor missing from the rows (normalized-name match) → "Falta identificar como propietario real a {nombre} ({pct}% de participación)."
  - mayores exist and any row is ADMINISTRADOR → "Hay accionistas con 25% o más: el administrador solo se identifica como propietario real en su defecto."
- Table **aviso**: PM shareholders with ≥ 25% → "{DENOMINACIÓN} ({pct}%), …: es persona moral; identifique a las personas físicas que la controlan."
- **"Proponer con la estructura accionaria"** button (`CCS:456-469`, `FORM:237-245`):
  - If mayores exist → one row per mayor: criterio `PARTICIPACION`, names, nacionalidad (or `MX`), participación, empty birth date.
  - Else → one row per representative with cargo `ADMINISTRADOR_UNICO` or `CONSEJERO`: criterio `ADMINISTRADOR`, names, nacionalidad `MX`, empty participación.
  - A proposed row whose normalized name matches an existing row keeps that row's captured data but takes the proposed criterio and participación.
  - **The proposal replaces the whole table.** Existing rows not in the proposal are dropped.
  - Empty proposal → error toast "No hay accionistas personas físicas con 25% o más ni un administrador en la lista de quienes pueden obligarla."

#### 3.4 Catalogs and fixed option lists the fields use
Catalogs (`SQL/02:55-106`, `SQL/03:41-127`). `grado` drives risk points (§5).

| Catálogo | Values (clave · descripción · grado) |
|---|---|
| PAISES | ISO 3166-1 alfa-2, ≈250 rows (`SQL/02:115-365`). **All `BAJO` in the seed** (no country flagged). `MX` sorts first. |
| ENTIDADES | RENAPO: AS, BC, BS, CC, CL, CM, CS, CH, DF (Ciudad de México), DG, GT, GR, HG, JC, MC (Estado de México), MN, MS, NT, NL, OC, PL, QT, QR, SP, SL, SR, TC, TS, TL, VZ, YN, ZS, plus `NE` "Nacido en el extranjero" (hidden from selects). All BAJO. |
| LOCALIDADES | One example: `01001002` "CIUDAD DE MÉXICO (ejemplo del instructivo; cargue el catálogo oficial)", attr `entidad = DF` |
| OCUPACIONES | **ALTO:** INMOBILIARIO Compraventa de inmuebles · AUTOS Compraventa de vehículos · JOYERIA Comercio de joyas, metales o piedras preciosas · ARTE Comercio de obras de arte · JUEGOS Juegos con apuesta, sorteos o casinos · CAMBIARIO Actividad cambiaria / transmisión de dinero · ACTIVOS_VIRT Activos virtuales. **MEDIO:** SERV_PUBLICO Servidor público · COMERCIANTE Comerciante · EMPRESARIO Empresario / accionista · CONSTRUCCION Construcción · NOTARIO Notario / corredor público · ABOGADO Abogado / contador / asesor financiero · ONG Organización sin fines de lucro. **BAJO:** EMPLEADO Empleado del sector privado · ESTUDIANTE Estudiante · HOGAR Dedicado al hogar · JUBILADO Jubilado / pensionado · PROFESIONISTA Profesionista independiente · AGRICULTOR Agricultor / ganadero · TRANSPORTISTA Transportista · TURISMO Servicios turísticos · MILITAR Fuerzas armadas · DESEMPLEADO Sin ocupación · OTRA Otra (especificar) |
| ORIGEN_RECURSOS | **ALTO:** PREMIO Premio o sorteo. **MEDIO:** NEGOCIO Ingresos de negocio propio · REMESAS Remesas recibidas del extranjero · VENTA_BIENES Venta de bienes · HERENCIA Herencia o donación · OTRO Otro (especificar). **BAJO:** SALARIO Sueldo o salario · PENSION Pensión · AHORROS Ahorros propios · HONORARIOS Honorarios profesionales · PRESTAMO Préstamo |
| DESTINO_RECURSOS | **MEDIO:** OTRO Otro (especificar). **BAJO:** VIAJE Viaje o turismo · PAGO_EXTRANJERO Pagos en el extranjero · MERCANCIA Compra de mercancía · AHORRO Ahorro en moneda extranjera · ENVIO_FAMILIAR Envío a familiares · COLEGIATURAS Colegiaturas · GASTOS_MX Gastos en México (venta de divisas) |
| DIVISAS | USD Dólar estadounidense · EUR Euro · CAD Dólar canadiense · GBP Libra esterlina · JPY Yen japonés · CHF Franco suizo |
| ANTECEDENTES | `1` "Bajo: sin alertas ni incidencias; comportamiento consistente." BAJO · `2` "Medio: operaciones o comportamientos que requirieron revisión, sin elementos para considerarlos inusuales." MEDIO · `3` "Alto: alertas recurrentes, inconsistencias relevantes, comportamiento atípico o información pública relevante." ALTO. The detail shows only the text before ":" |
| CONDICION_PEP | NO "No es PEP" BAJO · NACIONAL "PEP nacional" ALTO · ASIMILADA "PEP asimilada (familiar o socio cercano)" MEDIO · EXTRANJERA "PEP extranjera (ALTO por disposición)" ALTO |

TIPOS_IDENTIFICACION (`SQL/02:67-80`):
| Clave | Descripción | Nacionales | Extranjeros | Vigencia | Trae CURP | Trae domicilio |
|---|---|---|---|---|---|---|
| INE | Credencial para votar (INE) | 1 | 0 | 1 | 1 | 1 |
| PASAPORTE | Pasaporte | 1 | 1 | 1 | 0 | 0 |
| CEDULA_PROF | Cédula profesional | 1 | 0 | 0 | 0 | 0 |
| CARTILLA | Cartilla del Servicio Militar Nacional | 1 | 0 | 0 | 0 | 0 |
| MATRICULA | Certificado de matrícula consular | 1 | 0 | 1 | 0 | 0 |
| TUIM | Tarjeta única de identidad militar | 1 | 0 | 1 | 0 | 0 |
| INAPAM | Tarjeta de afiliación INAPAM | 1 | 0 | 0 | 1 | 0 |
| IMSS_ISSSTE | Credencial IMSS, ISSSTE o ISSFAM | 1 | 0 | 0 | 0 | 0 |
| LICENCIA | Licencia para conducir | 1 | 0 | 1 | 0 | 1 |
| CRED_GOB | Credencial de autoridad federal, estatal o municipal | 1 | 0 | 1 | 0 | 0 |
| CONST_MUN | Constancia de identidad de autoridad municipal | 1 | 0 | 1 | 0 | 0 |
| DOC_INM | Documento migratorio del INM (tarjeta de residente) | 0 | 1 | 1 | 0 | 0 |
| TARJ_SRE | Tarjeta de acreditación SRE (diplomáticos) | 0 | 1 | 1 | 0 | 0 |

Fixed option lists in code: condición de estancia, género, tipo PEP, cuenta propia, cargos de representante, criterio de propietario, tipo de accionista (all listed in the tables above).

#### 3.5 Identifier rules (`utils/curp.ts`, `utils/validaciones.ts`)
- **CURP format:** `^[A-Z][AEIOUX][A-Z]{2}\d{6}[HMX][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z\d]\d$`.
  - Fails → "La CURP no tiene el formato correcto (18 caracteres: 4 letras, 6 números de fecha, H/M, 2 letras de entidad, 3 consonantes, 2 caracteres finales)."
- **CURP check digit:** dictionary `0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ`; `s = Σ_{i=0..16} idx(c_i)·(18−i)`; `dv = 10 − s mod 10` (10 → 0).
  - Mismatch → "CURP: el último dígito (verificador) no corresponde a los 17 caracteres anteriores; para ellos debería ser {dv}. Revise que esté bien escrita comparándola con la identificación."
- **CURP data:** date = chars 5–10 (yymmdd); century 1900 if char 17 is a digit, else 2000; género = char 11; entidad = chars 12–13. Then, in order:
  - "La fecha contenida en la CURP no existe."
  - "La fecha de nacimiento no coincide con la CURP."
  - "El género no coincide con la CURP."
  - "La entidad de nacimiento no coincide con la CURP."
- **CURP generation** (`curp.ts:85-100`). Needs nombres, ≥ 1 apellido, a valid date, género ∈ H/M/X and an entidad (`NE` if born abroad). Steps:
  1. Clean: uppercase, `Ñ`→`X`, strip accents and non-letters.
  2. Drop particles (DA, DAS, DE, DEL, DER, DI, DIE, DD, EL, LA, LOS, LAS, LE, LES, MAC, MC, VAN, VON, Y) unless nothing would remain.
  3. Skip a leading common first name (MARIA, MA, MA., M, M., JOSE, J, J.) if there is a second name.
  4. Paterno = paterno, or materno if paterno is empty. Materno = `X` unless both exist.
  5. Letters = paterno[0] + first inner vowel of paterno (else X) + materno[0] + nombre[0]. If the result is in the inconvenient-words list, the 2nd letter becomes `X`.
  6. Then yymmdd + género + entidad + first inner consonant of paterno, materno and nombre (else X).
  7. Char 17 = `0` (born < 2000) or `A`; char 18 = check digit.
- **Auto-generate** (`FORM:23, 208-222`):
  - Fields that trigger it: nombres, apellidos, fecha_nacimiento, genero, entidad_nacimiento, pais_nacimiento.
  - It regenerates on any of those changes **unless the user typed the CURP by hand**. On edit, an existing CURP counts as hand-typed.
  - Dynamic note: "Generada con los datos capturados: compárela con la identificación (el penúltimo carácter lo asigna RENAPO)" or "Se genera sola al capturar nombre, apellidos, fecha, género y entidad de nacimiento".
- **Auto-fill from a typed CURP** (`FORM:225-234`): a valid CURP (format + check digit) fills fecha_nacimiento, genero and entidad_nacimiento (unless `NE`), **only if those are empty**.
- **RFC PF:** `^[A-ZÑ&]{4}\d{6}[A-Z\d]{2}[A\d]$`.
  - Fails → "El RFC de persona física debe tener 13 caracteres (4 letras, 6 números de fecha y 3 de homoclave)."
  - chars 5–10 ≠ birth yymmdd → "La fecha contenida en el RFC no coincide con la fecha de nacimiento."
- **RFC PM:** `^[A-ZÑ&]{3}\d{6}[A-Z\d]{2}[A\d]$`.
  - Fails → "El RFC de persona moral debe tener 12 caracteres (3 letras, 6 números de fecha y 3 de homoclave)."
  - chars 4–9 ≠ constitution yymmdd → "La fecha contenida en el RFC no coincide con la fecha de constitución."

#### 3.6 Save-time normalization (`CS:331-373`)
- Empty values are saved as null. Booleans are saved as 0/1.
- `tipo_pep`, `pep_cargo` and `pep_fecha_fin_cargo` are nulled when `es_pep` is false.
- `entidad_nacimiento`: `NE` when born abroad.
- `condicion_estancia`: `NACIONAL` when MX.
- `dom_localidad`: null when not MX.
- Comparece `fecha_vencimiento`: null when the ID type needs no vigencia. The PF `fecha_vencimiento_id` is saved as typed.
- Fields that are hidden but hold data keep their value in the record (they're just not validated), except the cases above.
- PM persons are rewritten only if any column changed. The previous rows become `vigente = 0` (`CS:531-546`).

### Data
- One field definition per row of the tables above (79 definitions: 59 apply to PF, 44 to PM, 24 shared), plus 18 table columns.
- Persisted columns: §1 Data. Table rows map to `cliente_personas` (rol, clave, tipo_persona, nombres, apellidos, fecha_nacimiento, nacionalidad, cargo, participacion, criterio, comparece, ID fields, orden, vigente).
- Quien comparece is stored as a `COMPARECIENTE` person with clave `COMPARECIENTE` plus the ID columns (`CS:518-523`).

### UI
- One full page. One card per group: tipo de persona (create only), nivel, then a single card with every section in order. Hidden sections stay in the DOM with `[hidden]` (`FORM html:22-48`).
- Section header: título + "Nivel N" badge (when the section has a level) + ayuda paragraph.
- Field: label + red `*` when required; control; nota (muted); error (red); aviso (amber) (`cmp/campo-cliente html`).
- Control rules:
  - select starts with "Seleccione…"
  - textarea is 3 rows
  - fecha is a DD/MM/AAAA masked input with a calendar button
  - casilla label sits beside the checkbox
  - multi = a checkbox group; radio = a radio group
- Error display (`FORM:100-102`): "Dato obligatorio para este nivel." shows **only after a save attempt**. Other errors show as soon as the field has a value. Save-side errors (duplicate CURP/RFC/ID) show on the field until the next edit.
- Read-only select (`antecedentes` for roles without `asignarAntecedentes`) is disabled.
- Table field: label + `*`; table with "#", columns, "Quitar" per row; empty row "Sin registros. Use «+ Agregar»."; buttons "+ Agregar" and the proponer button; nota, error, aviso below.
- Failed save: toast "Faltan o hay errores en {n} dato(s)." and scroll/focus to the first error (`FORM:268-275, 340-346`).

### Demo source
`SEC:5-34`; `CCS:28-313, 316-331, 441-501`; `T-CLI:56-105`; `cmp/campo-cliente`; `cmp/campo-tabla`; `FORM:23, 88-115, 174-245`; `utils/curp.ts`; `utils/validaciones.ts`; `CS:331-373, 517-546`; catalogs `SQL/02:55-106`, `SQL/03:41-127`.

### OPEN
- **O-3.1** Dynamic `crit_<codigo>` questions come from the matrix config (dropped). The seed has none. Drop the mechanism, or keep it fixture-driven?
- **O-3.2** `antecedentes` is editable only by OC; everyone else keeps the previous value. Who edits it in the new app (SUPERADMIN only?), and is the default still `1`?
- **O-3.3** `perfil_divisas` uses demo DIVISAS (USD, EUR, CAD, GBP, JPY, CHF). The new app's currencies are USD, EUR, JPY, CNY, KRW. Which list?
- **O-3.4** Perfil notes promise "se genera una alerta de operación inusual", but alerts are dropped. Keep or change the copy?
- **O-3.5** ORIGEN/DESTINO "Otro (especificar)" has no detail field (only ocupación `OTRA` has one). Add one?
- **O-3.6** `doc_curp_en_identificacion` shows for any mexican client, not gated by the ID type's "trae CURP" attribute (the domicilio flag is gated). Keep the asymmetry?
- **O-3.7** The no-abbreviation rule skips `denominacion` and `pr_*` names. Keep?
- **O-3.8** Hidden fields keep stale values in the record. Clear them when hidden?
- **O-3.9** "Proponer" replaces the whole propietarios table. Keep, or merge?
- **O-3.10** Under-age is only a warning ("El usuario tiene N años."), not a block. Keep?
- **O-3.11** Form build approach: a data-driven field-definition table with `req`/`ver` functions (demo), or hand-written Angular form controls per section?

---

## 4. Documents

### Behavior
**Fixed documents** (`DOC:7-20`) and when each applies (`CCS:357-367`):
| tipo | Persona | Nombre (literal) | Nivel | Con fecha | Required when |
|---|---|---|---|---|---|
| `IDENTIFICACION` | PF | Copia de la identificación oficial | 2 | — | always |
| `CONSTANCIA_CURP` | PF | Constancia de CURP | 3 | — | esMX and not `doc_curp_en_identificacion` |
| `COMPROBANTE_DOMICILIO` | PF | Comprobante de domicilio | 3 | ✔ | not (`doc_domicilio_coincide` and ID `incluye_domicilio`) |
| `DOCUMENTO_MIGRATORIO` | PF | Documento migratorio (INM) | 3 | — | esResidenteExt |
| `IDENTIFICACION` | PM | Identificación oficial de quien comparece | 2 | — | always |
| `ACTA_CONSTITUTIVA` | PM | Acta constitutiva inscrita en el Registro Público · renamed "Acta constitutiva (en trámite de inscripción)" when `reciente_constitucion` | 3 | — | always |
| `ESCRITO_COMPROMISO` | PM | Escrito de compromiso (reciente constitución) | 3 | — | `reciente_constitucion` |
| `CEDULA_FISCAL` | PM | Cédula de identificación fiscal | 3 | — | esMX or RFC captured |
| `FIEL` | PM | Constancia de la FIEL (e.firma) | 3 | — | `serie_firma_electronica` captured |
| `COMPROBANTE_DOMICILIO` | PM | Comprobante de domicilio | 3 | ✔ | always |
| `PODER` | PM | Poder de quien comparece | 3 | — | always |
| `DECLARACION_PROPIETARIOS` | PM | Declaración del representante sobre los propietarios reales | 3 | — | always |

**Per-representative documents (PM, level 3)** (`CCS:349-353`, `DOC:24-27`): for each `representantes` row **not** marked `comparece`:
- key `PODER:<clave>`, name "Poder de {nombre completo}"
- key `IDENTIFICACION:<clave>`, name "Identificación oficial de {nombre completo}"
- Name fallback: "representante sin nombre". Always required.
- The comparece's documents are the fixed IDENTIFICACION + PODER.

**Shown in the form** only when `doc.nivel <= chosen level` **and** required (`FORM:117-126`). Optional documents can't be uploaded.

**Validation per required document** (`CCS:386-398`):
1. none → "Falta: {nombre}."
2. not cotejado → "Marque que la copia se cotejó contra el original."
3. `conFecha` (comprobantes):
   - invalid date → "Capture la fecha de emisión del comprobante."
   - future → "La fecha de emisión no puede ser futura."
   - `mesesEntre(fecha, hoy) >= VIGENCIA_COMPROBANTE_DOMICILIO_MESES` (3) → "El comprobante tiene más de {tope} meses de antigüedad."
   - `mesesEntre` = whole months, minus 1 if the end day < the start day (`utils/fechas.ts:41-45`).

**Upload** (`cmp/documentos-carga:34-57`):
- One file per document. `accept="image/*,application/pdf"`.
- Size > `ARCHIVO_TAMANO_MAX_KB` × 1024 → toast "El archivo pesa {tamaño}; el máximo es {max} KB." and reset.
- Mime not `image/*` and not `application/pdf` → toast "Solo se aceptan imágenes o PDF."
- Captured: `nombre_archivo`, `mime_type`, `tamano_bytes`, the bytes, `sha256`.
- `fecha_documento` is carried over from the previous file of that type; `cotejado_original` resets to `false`.
- SHA-256 via `crypto.subtle.digest`, lowercase hex. Fallback when unavailable: FNV-1a 32-bit as `fnv1a-<hex>` (`utils/sha256.ts`).
- Size display: > 1 MB → "x.x MB", else "N KB" (min 1) (`utils/formato.ts:16`).

**Save** (`CS:422-445`, `FORM:292-294`):
- Only new files whose key is still in the current document list are written.
- A new file makes the previous **vigente** file of the same type (and same person) `vigente = 0` (kept, not deleted).
- Edits to fecha / cotejado on already-saved files are updated in place.
- PM: documents of representatives removed from the list, or now marked comparece, become `vigente = 0`.

**Viewer** (`cmp/documento-dialog`): image → `<img>`; PDF → `<iframe>` + note "Si su navegador no muestra la vista previa, use «Descargar»."; other → "Este tipo de archivo no tiene vista previa; descárguelo para abrirlo." Buttons "Descargar" (original file name) and "Cerrar". Width 900, height ≈ 70vh. The object URL is revoked on close.

### Data
`DocumentoCliente` (`T-CLI:12-25`; table `SQL/15:54-71`):
| Field | Type | Notes |
|---|---|---|
| `id` | number | — |
| `tipo_documento` | enum | IDENTIFICACION, CONSTANCIA_CURP, COMPROBANTE_DOMICILIO, DOCUMENTO_MIGRATORIO, CEDULA_FISCAL, ACTA_CONSTITUTIVA, ESCRITO_COMPROMISO, FIEL, PODER, DECLARACION_PROPIETARIOS, OTRO |
| `persona_clave` | string \| null | the representative's `clave`; form key = `<tipo>:<clave>` |
| `nombre_archivo` | string | — |
| `mime_type` | string | — |
| `tamano_bytes` | number | — |
| `contenido` | bytes | the demo stores the BLOB; loaded only for the viewer |
| `sha256` | string | hex, or `fnv1a-…` |
| `fecha_documento` | ISO date \| null | emission date (comprobantes) |
| `cotejado_original` | boolean | — |
| `cargado_por` / `cargado_en` | user / datetime | — |
| `vigente` | boolean | false = replaced |

### UI
- Form, inside "Copias de documentos". Per document:
  - name + "Nivel N" badge
  - status: "✔ {archivo} ({tamaño})" plus " · nuevo" for an unsaved file, or "Sin archivo"
  - file input
  - "Fecha de emisión" (only `conFecha`; disabled until a file exists)
  - checkbox "Cotejado contra el original" (disabled until a file exists)
  - error line (after a save attempt)
- Expediente "Documentos" card:
  - table: Documento · Archivo (+ size, muted) · Fecha · Cotejado ("Sí" ok pill / "No" warn pill) · Huella SHA-256 (first 16 chars + "…", full hash on hover, mono) · "Ver"
  - only vigente files
  - empty: "Sin documentos digitalizados."
  - name lookup: current requirement name → fixed doc name → raw tipo (`EXP:192-196`)

### Demo source
`DOC:1-27`; `CCS:342-367, 385-398`; `cmp/documentos-carga`; `cmp/documento-dialog`; `FORM:117-126, 247-257, 292-294`; `CS:217-225, 422-445`; `EXP html:97-126`; `utils/sha256.ts`; `SQL/15:54-71`.

### OPEN
- **O-4.1** File content with no persistence outside NGXS. Options: (a) base64 / data URL in NGXS state; (b) in-memory object URLs (lost on reload); (c) metadata only in fixtures with a placeholder viewer.
- **O-4.2** Keep the 1500 KB limit and the image/PDF-only rule? Source of the limit (O-0.3)?
- **O-4.3** Keep the FNV-1a fallback when `crypto.subtle` is missing?
- **O-4.4** Optional documents can't be uploaded, and the `OTRO` type has no UI. Allow extra / optional uploads?
- **O-4.5** Replaced files (`vigente = 0`): keep and show a history, or overwrite (O-0.6)?
- **O-4.6** Cotejo can be toggled on edit with no record of who checked it or when. Track it?

---

## 5. Risk grade, matrix criteria and the high-risk questionnaire

### Behavior
**Score** (`MS:53-57, 91-118`):
```
for each ACTIVE criterion c, ordered by (orden, nombre):
  valor = c.campo_cliente === 'condicion_pep' ? (d.es_pep ? (d.tipo_pep || 'NACIONAL') : 'NO')
        : c.campo_cliente ? d[c.campo_cliente]
        : d['crit_' + c.codigo]
  if valor empty → factor {valor: null, descripcion: 'Sin dato', puntos: 0}
  else puntos = matriz_puntajes[c.codigo][valor] ?? c.puntaje_defecto   (porDefecto = no row)
puntaje = Σ puntos
forzadoAlto = (es_pep && tipo_pep === 'EXTRANJERA') ? 'PEP extranjera (18ª)' : null
if a list hit forces high risk → forzadoAlto = 'Coincidencia en lista {lista_nombre}'   (overrides the PEP text)
grado = forzadoAlto ? 'ALTO' : gradoDe(puntaje)
```
- `gradoDe(p)`: the first scale with `desde <= p <= hasta` (`hasta` null = ∞). If none (a gap, e.g. 100.5), the highest scale with `desde <= p`. Else the first scale's grade, else `BAJO` (`MS:60-67`).
- **The criterion's `nivel` is ignored by the score.** Every active criterion counts at every level, so empty level-3 data scores 0 at levels 1–2.
- Factor `descripcion` = catalog description of the value (or the raw value). `grado` = the value's catalog grade.

**Seed criteria** (`SQL/03:294-301`):
| Código | Nombre | Catálogo | Campo | Nivel | Oblig. | Puntaje por defecto | Orden |
|---|---|---|---|---|---|---|---|
| ORIGEN_RECURSOS | Origen de los recursos | ORIGEN_RECURSOS | perfil_origen_recursos | 3 | 1 | 10 | 1 |
| DESTINO_RECURSOS | Destino de los recursos | DESTINO_RECURSOS | perfil_destino_recursos | 3 | 1 | 10 | 2 |
| OCUPACION | Ocupación, profesión o actividad | OCUPACIONES | ocupacion | 3 | 1 | 10 | 3 |
| ENTIDAD_RESIDENCIA | Entidad federativa / estado de residencia | ENTIDADES | dom_entidad | 1 | 1 | 10 | 4 |
| PAIS_RESIDENCIA | País de residencia | PAISES | dom_pais | 1 | 1 | 10 | 5 |
| ANTECEDENTES | Antecedentes del usuario | ANTECEDENTES | antecedentes | 1 | 1 | 0 | 6 |
| CONDICION_PEP | Persona Políticamente Expuesta | CONDICION_PEP | condicion_pep | 3 | 1 | 0 | 7 |

**Seed points** (`SQL/03:304-311`):
- The first five criteria: every catalog value by its grade, **BAJO 10 · MEDIO 50 · ALTO 100**.
- ANTECEDENTES: `1` → 10, `2` → 100, `3` → 250.
- CONDICION_PEP: NO → 0, ASIMILADA → 50, NACIONAL → 100, EXTRANJERA → 250.
- A value with no points row (e.g. a free-text foreign `dom_entidad`) gets the default (10 for the first five) and is flagged "(puntaje por defecto)".

**Seed scale** (`SQL/03:313-314`): **BAJO 0–100 · MEDIO 101–250 · ALTO 251+**.
- Integrity rules (from the config screen, `MS:70-88`):
  - BAJO and ALTO must exist
  - BAJO starts at 0
  - each next `desde` = previous `hasta` + 1
  - the last has no `hasta`

**Worked examples** (seed values):
| Case | Points | Grade |
|---|---|---|
| PF MX, level 1, antecedentes 1, no PEP | ENTIDAD 10 + PAIS 10 + ANTEC 10 + PEP "NO" 0 = 30 | BAJO |
| Same at level 3, all BAJO answers | 30 + ORIGEN 10 + DESTINO 10 + OCUP 10 = 60 | BAJO |
| Level 3 + ocupación JOYERIA | 60 − 10 + 100 = 150 | MEDIO |
| Level 3 + PEP NACIONAL | 60 + 100 = 160 | MEDIO |
| Level 3 + origen PREMIO + ocupación CAMBIARIO | 60 − 20 + 200 = 240 | MEDIO |
| Any level, antecedentes 3 | ≥ 30 − 10 + 250 = 270 | ALTO |
| PEP EXTRANJERA | any | ALTO (forced) |
| PM level 1 | ENTIDAD 10 + PAIS 10 + ANTEC 10 (OCUPACION "Sin dato", PEP "NO" 0) = 30 | BAJO |

**Where the grade is used:**
| Rule | Threshold |
|---|---|
| `estructura_corporativa` (PM) shows and is required | grade ≠ BAJO |
| `cuestionario` section shows (level 3) and its 4 fields are required | grade = ALTO |
| Op requires authorization: "Usuario de grado de riesgo alto (17ª)" (`OPS:185`) | stored grade = ALTO |
| Alert `CLIENTE_ALTO_RIESGO` on save (`CS:576-578`) | becomes ALTO from non-ALTO |
| Alert `CLIENTE_RIESGO_MEDIO` on save (`CS:579-580`) | becomes MEDIO from BAJO or new |
| Alert `PAIS_ALTO_RIESGO` on save (`MS:121-124`, `CS:473-476`) | nacionalidad, pais_nacimiento or dom_pais has catalog grade ALTO (none in the seed) |

**When it's computed:**
1. **Live in the form**, on every change: `calcularRiesgo(datos)` with **no list hits** → `__riesgo` (drives estructura / cuestionario visibility and the "Riesgo estimado" badge) (`FORM:84-85`).
2. **On save**: `calcularRiesgo` with the saved antecedentes and the firm "alto riesgo" list hit, if any. Stores `grado_riesgo`, `puntaje_riesgo` and `detalle_riesgo` (full result JSON incl. scales) (`CS:322, 346`).
3. **After a list hit** with ALTO_RIESGO (save, manual consult or dictamen CONFIRMADA): grade set to ALTO if not already; the detail JSON gets `grado: 'ALTO'` and `forzadoAlto` (`COI:210-222`).
4. **Recalculate all** (after a matrix change in Parámetros): re-scores every client with the saved list hits (`CS:586-603`).
- The detail page shows the **stored** result; it never recalculates on load.

**Questionnaire visibility mismatch:**
- In the form, `__riesgo` is the live estimate (no list hits).
- On the detail page, `evaluar` uses the stored grade (`CS:183`).
- So a client forced to ALTO by a list hit shows the questionnaire as missing in the completeness card, but the form doesn't show the section.

### Data
- `clientes.grado_riesgo` `BAJO|MEDIO|ALTO`, `puntaje_riesgo` REAL, `detalle_riesgo` JSON.
- `ResultadoRiesgo = { grado, puntaje, factores: {criterio, valor|null, descripcion, puntos, grado?, porDefecto?}[], forzadoAlto: string|null, escalas: {grado, desde, hasta|null, orden}[] }` (`model/types/matriz.ts`).
- `CriterioMatriz = { codigo, nombre, catalogo, campo_cliente|null, pregunta|null, nivel, obligatorio, puntaje_defecto, activo, orden }`.
- `matriz_puntajes (criterio, valor_clave, puntaje ≥ 0)`.
- `matriz_escalas (grado, desde, hasta|null, orden)`.
- `cliente_criterios (cliente_id, criterio, valor_clave)` for `crit_*` answers (`SQL/03:259-292`).

### UI
- Form action bar: "Riesgo estimado: {badge}". Roles with `verRiesgoDetalle` also see "({N} pts · {forzadoAlto})" (`FORM:128-135`).
- Badge text "Riesgo bajo|medio|alto" (ok / warn / danger). Short variant "bajo|medio|alto".
- Expediente card **"Cálculo del grado de riesgo"** (only `verRiesgoDetalle` and a stored result that has scales) (`cmp/riesgo-calculo-card`):
  - subtitle "Matriz de riesgo – Usuario (configurable en Parámetros)"
  - table: Criterio · Respuesta (description or "Sin dato" muted; short grade badge; "(puntaje por defecto)") · Puntos
  - total row "**Total** · escala: BAJO 0–100 · MEDIO 101–250 · ALTO 251+" and the total
  - forced row: "ALTO por disposición" danger pill + reason

### Demo source
`MS:44-124`; `SQL/03:259-314`; `CS:316-322, 346, 473-477, 569-603`; `COI:209-222, 238-243`; `FORM:84-86, 128-135`; `SEC:33`; `CCS:241-242`; `cmp/riesgo-calculo-card`; `OPS:185`.

### OPEN
- **O-5.1** Matrix, points, scales and catalog grades: where do they come from without the config module (fixture?), and can anyone edit them? No "recalculate all" without config.
- **O-5.2** Criterion `nivel` is ignored, so the score grows as levels add data. Keep, or score only criteria up to the client's level?
- **O-5.3** Questionnaire visibility: live estimate in the form vs stored grade on the detail page (list-forced ALTO). Which one rules?
- **O-5.4** Risk detail is hidden from CAJERO in the demo (badge only). Map `verRiesgoDetalle` to SUPERADMIN only?
- **O-5.5** Risk-change alerts (`CLIENTE_ALTO_RIESGO`, `CLIENTE_RIESGO_MEDIO`, `PAIS_ALTO_RIESGO`): drop, or log somewhere?
- **O-5.6** All seed countries are BAJO, so the country criterion is flat and `PAIS_ALTO_RIESGO` never fires. Seed some high-risk countries?
- **O-5.7** The stored risk never updates on load, only on save and list events. Keep?

---

## 6. PEP (Persona Políticamente Expuesta)

### Behavior
Fields (PF only, section `pep`, level 3, `CCS:273-279`):
| id | Etiqueta | Tipo | Ancho | Req | Visible | Nota | Opciones |
|---|---|---|---|---|---|---|---|
| `es_pep` | El usuario desempeña o desempeñó funciones públicas destacadas, o es familiar o socio cercano de quien las desempeña | casilla | a6 | nunca | — | — | — |
| `tipo_pep` | Tipo de PEP | select | a2 | siempre | `es_pep` | — | `NACIONAL` Nacional · `EXTRANJERA` Extranjera · `ASIMILADA` Asimilada (familiar o socio cercano) |
| `pep_cargo` | Cargo o función | texto | a2 | siempre | `es_pep` | — | — |
| `pep_fecha_fin_cargo` | Fecha en que dejó el cargo | fecha | a2 | nunca | `es_pep` | "Vacío si sigue en funciones" | — |

Section ayuda: "2ª fr. XXI. Incluye al cónyuge, concubino y parientes hasta segundo grado."

Effects:
| Area | Effect | Source |
|---|---|---|
| Risk points | CONDICION_PEP: NO 0 · ASIMILADA 50 · NACIONAL 100 · EXTRANJERA 250 (es_pep with empty tipo counts as NACIONAL) | `MS:54`, `SQL/03:311` |
| Risk grade | EXTRANJERA → forced ALTO, "PEP extranjera (18ª)" | `MS:112` |
| Levels | No direct level rule. Via ALTO (EXTRANJERA, or a high enough score), the level-3 questionnaire becomes required | `SEC:33` |
| Alerts on save | EXTRANJERA → `PEP_EXTRANJERA` "{nombre}: PEP extranjera (alto riesgo). Requiere aprobación de directivo para operar."; other PEP → `PEP_NACIONAL` "{nombre}: declarada como PEP." (detail: cargo) | `CS:468-472` |
| Operations | EXTRANJERA → PENDIENTE_AUTORIZACION "Usuario PEP extranjera (16ª)"; any ALTO → "Usuario de grado de riesgo alto (17ª)" | `OPS:184-185` |
| Save normalization | tipo, cargo and fecha fin nulled when `es_pep` is false | `CS:347-348` |
| Display | list: "PEP" warn pill; header: "PEP {tipo in lowercase}" warn pill; data grid: "Cargo PEP: {cargo} (hasta {fecha})" | `LISTA html:22`, `EXP html:10-12`, `EXP:117` |
| Unused | `PEP_NACIONAL_PERMANENCIA_ANIOS` = 1 ("Años que se sigue considerando PEP tras dejar el cargo.") is never read; `pep_fecha_fin_cargo` has no effect on anything | `SQL/02:20` |
| PEP lists | Lists `PEP_NAC` / `PEP_EXT` (actions ALERTAR_OFICIAL + CONTINUAR) only raise a hit (§7); they never set `es_pep` | `SQL/18:31-32` |
| PM | No PEP fields; `es_pep` stays 0 (the matrix shows "No es PEP" 0 pts) | — |

### Data
`clientes.es_pep` (0/1), `tipo_pep` (`NACIONAL|EXTRANJERA|ASIMILADA|null`), `pep_cargo`, `pep_fecha_fin_cargo` (ISO date).

### UI
Form section as above. Pills on the list and expediente header. Row in the data grid.

### Demo source
`CCS:272-279`; `SEC:29`; `MS:54, 112`; `CS:347-348, 468-472`; `OPS:184-185`; `EXP:117`; `EXP html:10-12`; `LISTA html:22`; `SQL/02:20`; `SQL/03:123-127, 311`.

### OPEN
- **O-6.1** PM has no PEP capture (for reps, shareholders or owners). Add, or keep PF only?
- **O-6.2** Apply `PEP_NACIONAL_PERMANENCIA_ANIOS` with `pep_fecha_fin_cargo` (e.g. stop counting as PEP one year after leaving office), or keep the field informational?
- **O-6.3** Should a PEP-list hit set or suggest `es_pep`?
- **O-6.4** PEP alerts are dropped (alerts module). The op-authorization side lives in operaciones (`02`). Confirm.

---

## 7. Blacklist check on save

### Behavior
**Who is searched** (`CS:259-279`). Persons with a non-empty name; each carries `persona` (rol), `nombre`, `fechaNacimiento`, `curp`, `rfc`, `tipoPersona`:
| Persona | PF client | PM client |
|---|---|---|
| CLIENTE | full name, fecha_nacimiento, curp, rfc, `PF` | denominación, **fecha_constitucion** (compared as a birth date), rfc, `PM` |
| PROPIETARIO_REAL | only if `actua_cuenta_propia = '0'` and `pr_nombres`: pr name + pr birth date | each `propietarios_reales` row: name + birth date |
| COMPARECIENTE | — | rep name + rep birth date |
| REPRESENTANTE | — | each non-comparece row (name only) |
| ACCIONISTA | — | each row; PM rows as a denominación with tipo `PM` (name only) |

**Which lists:**
- Active internal lists with `consulta_automatica = 1`, plus active providers with automatic lookup.
- Manual "Consultar en listas ahora" uses all active lists and providers (`COI:105-118`).
- Seed lists (`SQL/18:29-35`):

| Código | Nombre | Acciones |
|---|---|---|
| LPB | Personas Bloqueadas (UIF) | BLOQUEAR, ALERTAR_OFICIAL |
| PEP_NAC | PEP nacionales | ALERTAR_OFICIAL, CONTINUAR |
| PEP_EXT | PEP extranjeras | ALERTAR_OFICIAL, CONTINUAR |
| ONU | ONU | ALTO_RIESGO, ALERTAR_OFICIAL |
| OFAC | OFAC | ALTO_RIESGO, ALERTAR_OFICIAL |
| PROPIA | Lista propia | ALERTAR_OFICIAL, CONTINUAR |

- Seed test persons (`SQL/02:111-114`): `ROBERTO EJEMPLO BLOQUEADO` (LPB, 1975-05-20), `MARIA FUNCIONARIA DE PRUEBA` (PEP_NAC, 1968-03-15), `CARLOS SANCION EJEMPLO` (ONU).
- Test provider (mode PRUEBA, ALERTAR_OFICIAL) returns `JUAN PROVEEDOR DE PRUEBA` (1980-01-15), `LAURA EXTERNA SIMULADA`, `COMERCIALIZADORA FICTICIA DE PRUEBA` (RFC CFP100101AB1) (`PROV:48-52`).

**Similarity** (`utils/similitud.ts:10-27`):
- Trigram Jaccard (same idea as Postgres `pg_trgm`).
- For each word of `normalizarNombre(x).toLowerCase()`, pad as `"  " + palabra + " "` and collect every 3-char slice into a set.
- `sim = |A ∩ B| / (|A| + |B| − |A ∩ B|)`; 0 if either set is empty.
- Order-insensitive at word level.

**Classification** per list record (`LS:360-371`):
```
porIdentificador = (curp && rec.curp && rec.curp === curp) || (rfc && rec.rfc && rec.rfc === rfc)
mismaFecha = fechaNacimiento && rec.fecha_nacimiento === fechaNacimiento
COINCIDENCIA if porIdentificador || sim >= 0.85 || (sim >= 0.60 && mismaFecha)
POSIBLE      if sim >= 0.60
none         otherwise
sim stored rounded to 2 decimals
```
- Providers: use the provider's `similitud` (if in [0, 1]), else the computed one, with the same classification (`PROV:195-210`).
- `tipoPersona` is not used by internal list matching.

**Previous dictamen** (`COI:105-118`):
- A hit matches an earlier one by (fuente, registro_ref, persona, nombre_persona).
- Earlier `HOMONIMIA` → ignored (goes to `homonimias`, never alerts or blocks again).
- Earlier `PENDIENTE` / `CONFIRMADA` → still counts (`previo` set).

**Evaluation** (`COI:121-134`):
- `firme(h)` = `h.tipo === 'COINCIDENCIA' || h.previo === 'CONFIRMADA'`.
- Block: among hits with BLOQUEAR, the first firm one, else the first one.
  - Firm → status **BLOQUEADO**; else **SUSPENDIDO**.
  - Motive = "Listas: {coincidencia confirmada | coincidencia | posible homónimo} en «{lista}»" + (unless confirmada) ": pendiente del dictamen del Oficial de Cumplimiento".
- High risk: first hit with ALTO_RIESGO **and** firm → forces grade ALTO (§5).
- Authorization (used by operaciones): without a block, the hits lacking CONTINUAR.

**On save** (`CS:285-486`). Order:
1. Field validation (fail → errors, stop).
2. Hard duplicates (§8).
3. List lookup (async).
4. Status:
   - stays as before (new → ACTIVO)
   - becomes BLOQUEADO if the evaluation says BLOQUEADO
   - becomes SUSPENDIDO only if the evaluation says SUSPENDIDO **and** the status was ACTIVO
   - motive = the list motive, else the previous motive (edit) or null
   - **Status is never lifted by a save with no hits.**
5. Risk (§5).
6. Write.
7. Recompute level.
8. Register hits and alerts.

**Registering hits** (`COI:146-171`):
- New hits are stored as `cliente_listas` rows with `estatus = PENDIENTE`. Earlier ones only update `ultima_consulta_en`.
- Alert per new hit:

| Hit | Alert rule | Description |
|---|---|---|
| BLOQUEAR on LPB, COINCIDENCIA | `LPB_COINCIDENCIA` | "{quién}: coincidencia con la Lista de Personas Bloqueadas. Operación bloqueada. Se generó el Reporte de 24 horas." |
| BLOQUEAR on LPB, POSIBLE | `LPB_POSIBLE_HOMONIMO` | "{quién}: posible homónimo en la Lista de Personas Bloqueadas. Operación bloqueada hasta el dictamen del Oficial." |
| BLOQUEAR on other list | `LISTA_BLOQUEO` | "{quién}: {coincidencia\|posible homónimo} con la lista «{lista}». Operación bloqueada hasta que el Oficial de Cumplimiento la descarte por homonimia." |
| ALERTAR_OFICIAL (no BLOQUEAR) | `LISTA_COINCIDENCIA` | "{quién}: {coincidencia\|posible homónimo} con la lista «{lista}»." |
| neither | no alert | — |
| provider without response | `LISTAS_PROVEEDOR_SIN_RESPUESTA` | "{nombre}: no se pudo consultar al proveedor de listas «{proveedor}» ({error}). Consulte en listas desde el expediente." |

- `{quién}` = client name, or "{cliente} ({rol}: {persona})" for a linked person. Rol labels: propietario real, quien comparece, representante, accionista (`COI:15-17, 137-139`).
- Then, if a firm ALTO_RIESGO hit exists and the stored grade isn't ALTO → set ALTO + `CLIENTE_ALTO_RIESGO` alert (`COI:168-169, 210-222`).

**After save** (`FORM:314-326`):
- Result `bloqueado = estatus !== 'ACTIVO'` (any non-ACTIVO, including a status set earlier by hand).
- Blocked → **revision dialog**. Any `cliente_id` in the pending operation draft is cleared. Closing the dialog navigates to the expediente; it never returns to the operation.

**Revision dialog** (`cmp/revision-dialog`): title "Registro pendiente de revisión".
- With `verEstatusReal`: "El usuario quedó **BLOQUEADO|SUSPENDIDO** por coincidencia en listas." / "Se generaron {n} alerta(s). Revise el módulo de Alertas."
- Without it: "El expediente quedó pendiente de revisión por el área de cumplimiento." / "Por ahora no es posible operar con este usuario. Informe a su supervisor." / muted "No comente esta situación con el usuario."
- Button "Entendido".

**Dictamen** (OC only, from the expediente lists card) (`COI:275-317`):
- Only PENDIENTE hits. Notes must be ≥ 20 chars, else "Documente el dictamen (al menos 20 caracteres)."
- **HOMONIMIA:** the hit's alert → DESCARTADA. If the client is non-ACTIVO, the status motive starts with "Listas: " (or mentions "Lista de Personas Bloqueadas"), and no other PENDIENTE/CONFIRMADA hit with BLOQUEAR remains → ACTIVO, motive "Listas: homonimia dictaminada por el Oficial de Cumplimiento ({lista})".
- **CONFIRMADA:** alert → CONFIRMADA. BLOQUEAR → BLOQUEADO, motive "Listas: coincidencia confirmada en «{lista}»". ALTO_RIESGO → grade ALTO.
- Toasts: "Homonimia registrada: la coincidencia ya no alerta ni bloquea al usuario." / "Coincidencia confirmada: se aplican en firme las acciones de la lista."

**Manual consult** (OC) (`CS:492-514`):
- Same status rule as save; registers new hits.
- Toast "Consulta en todas las listas y proveedores: {n} coincidencia(s), {m} nueva(s)[, {k} ya dictaminada(s) como homonimia].[ Se generaron {a} alerta(s).]"
- Plus an error toast per silent provider: "Proveedor «{nombre}» sin respuesta: {mensaje}".

**"Estatus en listas" summary** (`COI:259-267`):
| Hits | Text | Tone |
|---|---|---|
| none | "Sin coincidencia en listas" | ok |
| any CONFIRMADA | "En listas: {listas}" | danger |
| any PENDIENTE | "Coincidencia en revisión: {listas}" | warn |
| only HOMONIMIA | "Homonimia" | neutral |

### Data
- `cliente_listas` (`SQL/18:120-143`): id, cliente_id, origen (`INTERNA|PROVEEDOR`), fuente (`L:<id>`/`P:<id>`), lista_id, proveedor_id, lista_nombre, registro_ref, persona (`CLIENTE|PROPIETARIO_REAL|COMPARECIENTE|REPRESENTANTE|ACCIONISTA`), nombre_persona, nombre_en_lista, similitud, tipo (`COINCIDENCIA|POSIBLE`), acciones (JSON), estatus (`PENDIENTE|HOMONIMIA|CONFIRMADA`), alerta_id, detectada_en, ultima_consulta_en, dictaminada_por/en, dictamen_notas. Unique (cliente, fuente, registro_ref, persona, nombre_persona).
- Lists: `listas` (codigo, nombre, consulta_automatica, acciones, activa, sistema) + `listas_personas` (nombre_completo, nombre_normalizado, fecha_nacimiento, curp, rfc, datos JSON, activo) (`SQL/18:15-87`).
- `AccionLista = BLOQUEAR | ALTO_RIESGO | ALERTAR_OFICIAL | CONTINUAR`. Labels: "Bloquear operación", "Generar aviso de alto riesgo", "Alertar al Oficial de Cumplimiento", "Continuar operación". BLOQUEAR and CONTINUAR are mutually exclusive.

### UI
- Save button reads "Consultando listas…" and is disabled while the async lookup runs.
- Revision dialog (above).
- Expediente card **"Listas negras"** (only `verEstatusReal`) (`cmp/cliente-listas-card`):
  - "Estatus en listas: {pill}"
  - OC: button "Consultar en listas ahora" ("Consultando…") + note "«Consultar en listas ahora» lee todas las listas internas (también las de consulta manual) y todos los proveedores activos."
  - "Listas en las que se encuentra" table:
    - Lista ("Lista interna" / "Proveedor de listas" · detected date)
    - Quién ("El usuario" / "{rol}: {nombre}")
    - Nombre en la lista
    - Similitud
    - Resultado ("Coincidencia" danger / "Posible homónimo" warn + action labels)
    - Dictamen ("Pendiente de dictamen" warn / "Homonimia" neutral / "Coincidencia confirmada" danger; who · when; notes; alert folio)
    - "Dictaminar" / "Cancelar"
  - Homonimia rows are muted and sort last.
  - Inline dictamen row:
    - label "Dictamen de la coincidencia con «{lista}»", textarea
    - note "Homonimia: no es la misma persona (la coincidencia ya no alerta ni bloquea). Confirmada: se aplican en firme las acciones de la lista."
    - buttons "Es homonimia" / "Confirmar coincidencia"

### Demo source
`CS:255-279, 310-329, 466-467, 488-514`; `COI:13-317`; `LS:333-371`; `PROV:46-52, 143-210`; `utils/similitud.ts`; `model/types/lista.ts`; `model/constants/acciones-lista.const.ts`; `cmp/revision-dialog`; `cmp/cliente-listas-card`; `FORM:296-320, 328-332`; `SQL/18`.

### OPEN
- **O-7.1** Blacklist data with the lists module dropped. Options: (a) a mock fixture of lists + persons and the same matching; (b) no check until the backend; (c) a stub service the backend replaces.
- **O-7.2** Per-list actions (BLOQUEAR / ALTO_RIESGO / ALERTAR_OFICIAL / CONTINUAR): fixture-defined, or simplified?
- **O-7.3** External providers (simulated in PRUEBA mode): drop?
- **O-7.4** Alerts created by hits are dropped. Replace with nothing, a flag on the client, or a bitácora entry?
- **O-7.5** Dictamen (homonimia / confirmada) is OC-only. Who does it in the new app (SUPERADMIN?), and where (keep the lists card)? Without it, a SUSPENDIDO client can only be lifted by a manual status change.
- **O-7.6** Keep "Consultar en listas ahora"?
- **O-7.7** Keep the async "Consultando listas…" state with mock data?
- **O-7.8** The revision dialog says "Revise el módulo de Alertas", a dropped module. New copy?
- **O-7.9** Keep the PM scope (comparece, reps, shareholders, owners all searched)?
- **O-7.10** A later clean save never lifts a list-set status. Keep?
- **O-7.11** Thresholds 0.6 / 0.85 come from parameters (O-0.3). PM matches its constitution date against list birth dates. Keep?

---

## 8. Duplicate detection

### Behavior
Two layers.

**A. Soft duplicates, before saving** (`CS:240-253`, `FORM:277-290`). Runs on every save attempt (create and edit; excludes the client itself):
| Persona | Precondition | Candidates | Match |
|---|---|---|---|
| PF | `nombres` set and valid `fecha_nacimiento` | clients with **exactly the same** `fecha_nacimiento` (so PF only) | `similitud(nombre_normalizado, nombreCompleto(d)) >= 0.6` |
| PM | `denominacion` set | all PM clients | `similitud(nombre_normalizado, denominacion) >= 0.85` |
- Thresholds are hard-coded (not parameters). Similarity = §7 trigram Jaccard.
- Any match opens the dialog. Answers:
  - "Abrir el existente" → navigate to the **first** match; save cancelled
  - "Es otra persona: guardar" → continue saving
  - close (X / Esc) → save cancelled, no message

**B. Hard duplicates, inside save** (`CS:291-308`). Each returns an error attached to the field:
| Check | Applies | Message |
|---|---|---|
| CURP already on another PF | PF with CURP | "Esta CURP ya pertenece al usuario {numero}." (on `curp`) |
| RFC already on another PM | PM with RFC | "Este RFC ya pertenece al usuario {numero}." (on `rfc`) |
| (tipo_identificacion, número) already on another PF | PF | "Esta identificación ya pertenece al usuario {numero}." (on `numero_identificacion`) |
- No check on PF RFC.
- A PM's comparece ID may repeat across companies (the same person can represent several).
- The form shows these on the field and as an error toast with the first message, then scrolls to it.

### Data
`ClienteResumen` match rows: `id, numero_cliente, tipo_persona, nombre_completo, fecha_nacimiento?, sim`.

### UI
Dialog **"Posible usuario ya registrado"** (`cmp/duplicados-dialog`):
- Intro: PM "Hay usuarios con denominación muy parecida:" / PF "Hay usuarios con nombre parecido y la misma fecha de nacimiento:"
- List of "**{numero}** {nombre}" (number in mono)
- Muted "Si es la misma persona, abra su expediente en lugar de crear uno nuevo."
- Buttons "Abrir el existente" (secondary) / "Es otra persona: guardar" (primary)

### Demo source
`CS:238-253, 291-308`; `FORM:259-263, 277-290, 307-312`; `cmp/duplicados-dialog`; `utils/similitud.ts`.

### OPEN
- **O-8.1** Keep the hard-coded 0.6 (PF) / 0.85 (PM) thresholds, or make them parameters?
- **O-8.2** PF soft duplicates need the exact same birth date (a typo in the date hides a duplicate), and PF RFC is not unique. Keep?
- **O-8.3** "Abrir el existente" opens only the first match even when several are listed. Per-row links instead?
- **O-8.4** Closing the dialog silently cancels the save. Keep?
- **O-8.5** The soft check also runs on edit (catching clients created after this one). Keep?

---

## 9. Estatus change and "Aviso al Oficial"

### Behavior
**States:** `ACTIVO | SUSPENDIDO | BLOQUEADO` (default ACTIVO) (`T-CLI:6`).

**Transitions:**
| From → to | Who / what | Motive |
|---|---|---|
| ACTIVO → SUSPENDIDO | save or manual consult with a BLOQUEAR "posible homónimo" hit | "Listas: posible homónimo en «…»: pendiente del dictamen del Oficial de Cumplimiento" |
| any → BLOQUEADO | save or manual consult with a firm BLOQUEAR hit; dictamen CONFIRMADA | "Listas: coincidencia en «…»: pendiente del dictamen…" / "Listas: coincidencia confirmada en «…»" |
| SUSPENDIDO/BLOQUEADO → ACTIVO | dictamen HOMONIMIA (only if the motive is from lists and no other block remains) | "Listas: homonimia dictaminada por el Oficial de Cumplimiento ({lista})" |
| any → any | manual, "Cambiar estatus" (`cambiarEstatus` = OC) | typed motive |

**Manual change** (`CS:559-567`):
- No permission → "Sin permiso."
- `motivo.trim().length < 10` → "Explique el motivo (al menos 10 caracteres)."
- Writes estatus, motivo_estatus (trimmed), actualizado_en; bitácora `CAMBIO_ESTATUS {de, a, motivo}`.
- The same status can be re-selected (no check).
- Success toast "Estatus actualizado."; errors as toasts, dialog stays open.

**Effects of non-ACTIVO:**
| Area | Effect | Source |
|---|---|---|
| Operations | blocked. With `verEstatusReal`: "El usuario está {ESTATUS}: no puede operar." Otherwise: "Por ahora no es posible operar con este usuario. Consulte a su supervisor." | `OPS:115-120` |
| "Nueva operación con este usuario" link | hidden | `cmp/cliente-operaciones-card:46` |
| Form | replaced by "Este expediente está en revisión por el área de cumplimiento. Consulte a su supervisor." unless `cambiarEstatus` | `FORM:75-77` |
| Edit button | hidden unless `cambiarEstatus` | `EXP:70` |
| Badge | non-OC sees "En revisión" (39ª) | §10 |
| Save result | any non-ACTIVO status after save opens the revision dialog | `FORM:314-320` |

**Aviso al Oficial** (any `capturarClientes` role) (`CS:549-556`, `cmp/aviso-oficial-dialog`):
- Motive select (`MOT:2-8`):

| v | Texto | Alert rule |
|---|---|---|
| DATOS_DUDOSOS | Se negó a dar datos o los documentos parecen falsos | DATOS_DUDOSOS |
| TERCERO | Parece actuar por cuenta de otra persona | AVISO_EMPLEADO |
| COMPORTAMIENTO | Operación o comportamiento inusual (no concuerda con su perfil) | AVISO_EMPLEADO |
| SOSPECHA_24H | URGENTE: hechos concretos de recursos ilícitos o terrorismo (reporte de 24 horas) | AVISO_24H |
| OTRO | Otro | AVISO_EMPLEADO |

- Default: the first motive. Description trimmed, `< 10` → toast "Describa lo observado (mínimo 10 caracteres)."
- Creates an alert (always, never deduplicated) with description "{nombre}: {descripción}", detail {motivo text, empleado}; bitácora `AVISO_EMPLEADO`. Returns the folio → toast "Aviso enviado ({folio})."
- **No status change, nothing told to the client.**

### Data
- `clientes.estatus`, `clientes.motivo_estatus`, `actualizado_en`.
- `CambioEstatus = { estatus, motivo }`.
- `AvisoOficial = { motivo, descripcion }`.

### UI
- Dialog **"Cambiar estatus del usuario"**: select "Nuevo estatus" (raw ACTIVO / SUSPENDIDO / BLOQUEADO, preselected current) · textarea "Motivo (queda en bitácora)" · "Cancelar" / "Guardar". Resets on open.
- Dialog **"Aviso al Oficial de Cumplimiento"**: muted "El aviso llega directo al Oficial de Cumplimiento (45ª). No informe al usuario." · select "Motivo" · textarea "Descripción" (placeholder "Describa lo observado", 4 rows) · "Cancelar" / "Enviar aviso". Resets on open.
- Both open from the expediente header buttons "Cambiar estatus" (OC) and "Aviso al Oficial" (capture roles).

### Demo source
`CS:548-567`; `COI:121-134, 275-317`; `cmp/cambiar-estatus-dialog`; `cmp/aviso-oficial-dialog`; `MOT:2-8`; `EXP:70, 200-219`; `EXP html:20-30`; `FORM:71-79`; `OPS:115-120`.

### OPEN
- **O-9.1** Who changes status (OC in the demo)? SUPERADMIN only?
- **O-9.2** Allow re-selecting the same status? Add a confirmation step? Keep the 10-char motive minimum?
- **O-9.3** "Aviso al Oficial" creates an alert (module dropped). Options: drop the button; keep it and log to bitácora; keep it as a note on the client.
- **O-9.4** With only SUPERADMIN capturing, the "en revisión" form block never triggers. Keep it for future CAJERO capture?
- **O-9.5** The revision dialog also opens when the client was already non-ACTIVO from a manual change (no new hit). Keep?
- **O-9.6** Operation blocking by status lives in operaciones (`02`). Confirm.

---

## 10. Expediente detail page and list page

### Behavior

**List** (`LISTA`, `CS:131-143`):
- One search box. Under 2 chars → the last 50 clients by id desc.
- ≥ 2 chars → match on any of:
  - `nombre_normalizado LIKE %n%` (n = normalized query)
  - `numero_cliente LIKE %Q%` (Q = uppercased query)
  - `curp LIKE %Q%`
  - `rfc LIKE Q%`
  - any identification `numero LIKE Q%`
  - `similitud(nombre_normalizado, n) >= 0.35`
- Ordered by similarity desc, limit 100. The whole row opens the expediente (click / Enter).
- Home counts (`CS:122-127`): total, per level (n1/n2/n3), ALTO, MEDIO, PEP, non-ACTIVO ("revision").

**Detail** (`EXP`). Content in render order, with role gating:
| Block | Content | Visible to |
|---|---|---|
| Header | name (h2); "{numero} · persona física\|moral · alta {fecha hora}" (mono); pills: Nivel N, Riesgo, "PEP {tipo}" (if PEP), estatus; bold "{puedeOperar}" line (§2); "Motivo: {motivo_estatus}" warn box when non-ACTIVO | all; motive only `verEstatusReal` |
| Header actions | "Completar / subir de nivel" (level < 3) or "Editar" | `capturarClientes` and (ACTIVO or `cambiarEstatus`) |
| | "Aviso al Oficial" | `capturarClientes` |
| | "Cambiar estatus" | `cambiarEstatus` |
| Completitud | "Completitud del expediente" + muted "4ª de la DCG"; 3 columns Nivel 1/2/3 with "Completo" (ok) / "Pendiente" (neutral); items ✓ / ✗ + label; specific error under failed items (not the generic "obligatorio" one); full error on hover; empty "Sin requisitos adicionales" | all |
| Datos del usuario | label/value grid; blanks → "—" (rows below) | all |
| PM persons (PM only) | "Personas que pueden obligarla" (Nombre · Cargo · Comparece Sí/—), "Estructura accionaria" (Accionista o socio · Persona Física/Moral · Nacionalidad · Participación), "Propietarios reales" (Nombre · Se identifica por · Nacimiento · Nacionalidad · Participación; "—" for administrador). Empty: "Sin capturar." / owners "Sin capturar (se requieren para el expediente completo)." | all |
| Documentos | §4 | all |
| Operaciones | "Perfil declarado contra lo operado este mes": 4 boxes, below. Last ops table: Folio (+ "Relevante") · Fecha · Operación ("Compra\|Venta {monto} {divisa}") · Equiv. USD · Estatus; empty "Sin operaciones."; "Nueva operación con este usuario" | all; link: `capturarOperaciones` and ACTIVO |
| Cálculo del grado de riesgo | §5 | `verRiesgoDetalle` |
| Listas negras | §7 | `verEstatusReal` |
| Alertas del usuario | Folio · Tipo · Regla · Generada · Plazo · Estatus; **excludes INTERNA_PREOCUPANTE** (confidential); link "Ver en Alertas PLD/FT"; empty "Sin alertas." | `verAlertas` |
| Not found | "Usuario inexistente." | — |

Operations boxes (`cmp/cliente-operaciones-card:30-44`):
| Box | Value | Profile line | "Excedido" pill when |
|---|---|---|---|
| Monto del mes | "{usd} USD" | "Declarado: {monto} USD" or "Sin perfil declarado" | month USD > declared |
| Operaciones del mes | count | "Declaradas: {n}" or "Sin perfil declarado" | count > declared |
| Divisas operadas | list or "—" | "Declaradas: …" or "Sin divisas declaradas" | a currency outside the declared ones |
| Operado hoy | "{usd} USD" | "Límite diario: {LIMITE_DIARIO_USD} USD" | never |

Data grid rows (`EXP:89-185`):
- **PF:**
  - Fecha de nacimiento "{fecha} ({edad} años)"
  - País de nacimiento · Nacionalidad · Entidad de nacimiento · Género · CURP · RFC · Ocupación
  - Condición de estancia (only non-NACIONAL; lowercase, underscores → spaces)
  - Identificación "{tipo} · {número}"
  - Vigencia de identificación ("No aplica" if none)
  - Domicilio: one line "calle, ext, int. N, colonia, municipio, ciudad, entidad, C.P. N, país"
  - Localidad (reportes) "{clave} · {desc}" (if set)
  - Teléfono · Correo
  - common rows (below)
  - Cargo PEP (if PEP)
  - Declaración ("Por cuenta propia ({fecha hora})" / "Por cuenta de un tercero")
  - Propietario real "{nombre} · {relación}" (if third party)
- **PM:**
  - Giro · Nacionalidad · RFC · No. de serie de la FIEL · Fecha de constitución · Domicilio · Localidad
  - Teléfono "{tel} · {tel2}" · Correo
  - Quien comparece "{nombre} · {carácter}"
  - Identificación de quien comparece · Vigencia de identificación
  - Reciente constitución ("Sí: acta en trámite de inscripción (escrito de compromiso)" / "No")
  - Estructura corporativa interna (if set)
  - common rows
- **Common:**
  - Antecedentes (text before ":")
  - one row per `crit_*` criterion
  - Monto mensual estimado "{n} USD" · Operaciones al mes · Origen de recursos · Destino de recursos · Divisas declaradas

**Confidentiality rule 39ª** (the client must not learn they're under review):
| Where | Without `verEstatusReal` | With it (OC) |
|---|---|---|
| Status pill (list, header) | ACTIVO → "Activo" (ok); anything else → **"En revisión"** (warn) | "Activo" / "Suspendido" (warn) / "Bloqueado" (danger) |
| Status motive | hidden | shown |
| Lists card | hidden | shown |
| Revision dialog after save | neutral copy | detail copy |
| Operation refusal | neutral copy | "El usuario está {ESTATUS}…" |
| Operation authorization motive | not shown to the cashier (`SQL/03:394`) | shown |
| INTERNA_PREOCUPANTE alerts | never shown in the expediente, for anyone | same |
- Source: `shared/components/badges/estatus-cliente-badge`; `PROTO:3303-3304`.

### Data
- List row `ClienteResumen` (`T-CLI:39-54`): `id, numero_cliente, tipo_persona, nombre_completo, nombre_normalizado, fecha_nacimiento, fecha_constitucion, curp, rfc, nivel_expediente, grado_riesgo, es_pep, estatus, sim?`.
- `numero_cliente` = "CLI-" + 6-digit zero-padded (max id + 1) (`CS:383-384`).
- Detail reads the full `DatosCliente` (§1).

### UI
- **List** (`LISTA html`):
  - label "Buscar usuario", placeholder "Nombre o denominación, número de usuario, CURP, RFC o identificación"
  - "+ Nuevo usuario" (`capturarClientes`)
  - columns: Número (mono) · Nombre o denominación (bold; "Persona moral" neutral pill; "PEP" warn pill) · Nacimiento / constitución · CURP / RFC (mono, "—") · Expediente (Nivel N pill, neutral for every level per D-21; the demo colors 1 neutral, 2 info, 3 ok) · Riesgo · Estatus
  - footer: "{n} resultado(s)." while searching / "Últimos usuarios registrados."
  - empty: "Sin resultados" + "Revise lo escrito o registre al usuario." / "Aún no hay usuarios" + "Registre el primero con «Nuevo usuario»."
- **Detail:** stacked cards in the order above.
- **Form page:** after a successful save, toast "Expediente guardado · nivel {n}." (reached ≥ chosen) or "Guardado. Nivel alcanzado: {n}.", then navigate to the expediente (or back to the operation with `?cliente=<id>`). Cancel → expediente (edit) or list (create). Not found → "Usuario inexistente."; role without capture → "Su rol no permite capturar usuarios."

### Demo source
`LISTA` (ts + html); `CS:122-143`; `EXP:51-220`; `EXP html:1-148`; `cmp/completitud-card`; `cmp/cliente-operaciones-card`; `cmp/cliente-alertas-card`; `cmp/cliente-listas-card`; `shared/components/badges/{estatus-cliente,nivel,riesgo}-badge`; `FORM:137-147, 321-326`; `clientes.routes.ts` (demo routes `/usuarios`, `nuevo`, `:id`, `:id/editar`).

### OPEN
- **O-10.1** 360 tab grouping (header card + tabs). Options:
  - (a) General (completitud + datos + PM persons) · Documentos · Operaciones · Riesgo y listas
  - (b) the cashier split proposed in `02`: General · Documentos · Operaciones
  - (c) one tab per demo card
- **O-10.2** 39ª mapping: SUPERADMIN sees the real status, motive and lists card; CAJERO sees "En revisión"? Confirm.
- **O-10.3** List: the demo's single search + last 50 vs the `01` rules (server-side paging, URL-persisted filters, "Filtros" popover). Which filters (tipo persona, nivel, riesgo, estatus, PEP)? Keep the 0.35 fuzzy name match?
- **O-10.4** Operations card: monthly totals and last ops need the operaciones fixtures; "Operado hoy" needs daily accumulation (monitoreo, dropped). Keep, compute from operaciones state, or drop?
- **O-10.5** Alerts card: drop with the alerts module?
- **O-10.6** Lists card: keep (depends on O-7.1 and O-7.5)?
- **O-10.7** Show the home counts (per level, ALTO, MEDIO, PEP, en revisión) as KPIs above the list?
- **O-10.8** Lead cell: `01` asks for `.lead-avatar` + name for people/companies; the demo has none. Confirm the avatar.
- **O-10.9** Header actions: `01` puts state changes as primary/danger buttons in the page header. Where do "Completar / subir de nivel", "Aviso al Oficial" and "Cambiar estatus" go?

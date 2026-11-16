# 04 — Negocio (centro cambiario profile + sucursales)

> **Status: DRAFT.** The lead asked (2026-11-13) for the General and Legal content to be **made up**, using the demo's "Datos Centro Cambiario" (`modules/datos-centro`, `services/sucursales`, parameters with `categoria = 'CENTRO_CAMBIARIO'`) as the starting point.
> - Everything tagged **[demo]** exists in the demo, with its validation.
> - Everything tagged **[propuesto]** is invented for this shell and should be reviewed with the product owner before production (especially the legal/regulatory fields).
>
> UI rules: `01-table-detail-rules.md` (detail views, forms as pages, mandatory Auditoría tab). Catalog keys: `plans/catalogos/` (official, verbatim).

## Decisions so far
| Topic | Decision |
|---|---|
| What it is | The centro cambiario's own profile and configuration (tenant data). Admin app only. |
| Tabs | **General · Legal · Sucursales · Auditoría.** The lead gave General · Legal · Auditoría and put branches inside negocio, so Sucursales sits as a tab before Auditoría (rule: Auditoría is always last). |
| Branches | Inside `negocio`: the list is the **Sucursales tab**. Create/edit are **pages** (forms-as-pages rule) and each branch has its own detail view. |

## Routes
| Route | Page |
|---|---|
| `/negocio` | Profile, opens on General (`?tab=general|legal|sucursales|auditoria`) |
| `/negocio/editar` | Full-page form for General + Legal data |
| `/negocio/sucursales/nueva`, `/negocio/sucursales/:id/editar` | Branch form pages. Save/cancel returns to `/negocio?tab=sucursales` |
| `/negocio/sucursales/:id` | Branch detail: tabs General · Cajas · Usuarios · Auditoría |

Page header: title "Negocio", the centro's nombre comercial as description, actions `Editar` (`btn-secondary`). Editing: SUPERADMIN (and, per the interim access rule, the admin-app roles; see `03` D-1).

## Tab: General
Panel sections split by hairlines (`05`), each with a `<dl>` field grid (`01` detail rules).

**Identidad**
| Field | Tipo | Rule | Tag |
|---|---|---|---|
| Nombre comercial | texto | required, ≤ 80 | [propuesto] |
| Denominación o razón social | texto | required, as in the acta constitutiva, no abbreviations | [propuesto] |
| RFC | texto | required, 12 chars (PM RFC format + check digit, reusing the expediente's RFC rule) | [propuesto] |
| Fecha de inicio de operaciones | fecha | required, not in the future | [propuesto] |
| Sucursal matriz | select (sucursales activas) | required | [propuesto] |

**Domicilio fiscal**
| Field | Tipo | Rule | Tag |
|---|---|---|---|
| Calle, número exterior, número interior, colonia | texto | calle/ext/colonia required | [propuesto] |
| Municipio / alcaldía | select | catalog `municipios.json` (CNBV), filtered by entidad | [propuesto] |
| Entidad federativa | select | catalog `entidades.json` (CNBV, 01–32) | [propuesto] |
| Código postal | texto | 5 digits | [propuesto] |
| Localidad | select | catalog `localidades.json` (CNBV, 8 digits) | [propuesto] |

**Contacto**
| Field | Tipo | Rule | Tag |
|---|---|---|---|
| Teléfono | texto | 10 digits | [propuesto] |
| Correo electrónico | texto | email format | [propuesto] |
| Sitio web | texto | URL, optional | [propuesto] |
| Horario de atención | texto | optional (e.g. "Lun–Sáb 9:00–18:00") | [propuesto] |

**Operación**
| Field | Tipo | Rule | Tag |
|---|---|---|---|
| Divisas que opera | multi-select | ISO 4217 currency catalog (`divisas.json`, `03` D-18), MXN excluded since it's the base. Seed: USD, EUR, JPY, CNY, KRW | [propuesto] |
| Límite diario por cliente (USD) | número | read-only here, it's the operations parameter (`LIMITE_DIARIO_USD`) | [demo] (as a parameter) |

## Tab: Legal

**Claves para los reportes oficiales** (the demo's `CENTRO_CAMBIARIO` parameters; info callout copied from the demo: *the órgano supervisor and the clave del centro go in columns 4 and 5 of the 41-column format and the CASFIM entity key in the dollar report (.FDE); localidad and código postal come from the branch where each operation happened*)
| Field | Rule | Fundamento shown | Tag |
|---|---|---|---|
| Clave del órgano supervisor (CASFIM) | format `99-999` (stored as shown; the reports derive the 6-digit form, e.g. `40-002 → 040002`) | "Formato oficial, col. 4" | [demo] |
| Clave del centro cambiario | 8 digits: `0` + sector (2) + clave asignada por la CNBV (5) | "Formato oficial, col. 5" | [demo] |
| Clave de la entidad (CASFIM) | required for the dollar report (.FDE) | "Reporte de dólares .FDE" | [demo] |

**Registro y autorización** [propuesto]
| Field | Tipo | Rule |
|---|---|---|
| Número de registro como centro cambiario | texto | required |
| Fecha de registro | fecha | required |
| Dictamen técnico en materia de PLD: número | texto | optional |
| Dictamen técnico: fecha de emisión / vigencia | fecha | vigencia ≥ emisión; a "Vence en N días" warn pill when < 60 days |

**Constitución** [propuesto]
| Field | Tipo | Rule |
|---|---|---|
| Escritura constitutiva: número | texto | required |
| Fecha de la escritura | fecha | required |
| Notario: nombre y número, entidad | texto + select | required |
| Folio mercantil (Registro Público de Comercio) | texto | required |

**Representante legal** [propuesto]
| Field | Tipo | Rule |
|---|---|---|
| Nombre completo | texto | required, no abbreviations |
| RFC / CURP | texto | expediente validators |
| Poder: escritura número, fecha, notario | texto/fecha | required |

**Oficial de Cumplimiento** [propuesto]
| Field | Tipo | Rule |
|---|---|---|
| Usuario designado | select (internal *usuarios*) | required |
| Fecha de designación | fecha | required |
| Fecha de notificación a la autoridad | fecha | optional, ≥ designación |

**Documentos legales** [propuesto]
A table (`.card-flush-table`) of the uploaded files, base64 in NGXS like the expediente (`03` D-4): Acta constitutiva, Poder del representante legal, Constancia de situación fiscal, Constancia de registro, Dictamen técnico, Manual de PLD. Columns: documento · archivo (size) · fecha · vigencia · `Ver`.

## Tab: Sucursales
List (TanStack, URL-persisted filters, `Filtros` popover with estatus and entidad; primary action "Nueva sucursal" → page).
| Column | Notes | Tag |
|---|---|---|
| Clave | `font-data` | [demo] |
| Nombre | lead cell `.lead-thumb-fallback` with a building glyph (a branch is a thing, `01`) | [demo] |
| Código postal | `font-data`; missing → warn pill "Falta" | [demo] |
| Localidad | clave + descripción from the CNBV catalog; missing → "Falta" | [demo] |
| Domicilio | | [demo] |
| Usuarios | count of assigned staff, `font-data` | [demo] ("Empleados") |
| Operaciones | count, `font-data` | [demo] |
| Estatus | Activa (ok) / Baja (neutral) | [demo] |
- Footnote [demo]: *"El código postal y la localidad de cada sucursal van en las columnas 7 y 6 de los reportes oficiales de las operaciones que se realizan en ella."*
- Row actions (`.row-action`): Editar, Dar de baja / Reactivar (confirmation dialog). The row itself opens the branch detail.

**Branch form rules [demo]:**
- **Clave:** 2–15 of `A–Z 0–9 _ -`, uppercased, unique. Errors: "La clave lleva de 2 a 15 letras, números, guion o guion bajo." / "Ya existe una sucursal con la clave {X}."
- **Nombre:** required. Error: "Indique el nombre de la sucursal."
- **Código postal:** 5 digits. Error: "El código postal lleva 5 dígitos."
- **Localidad:** 8 digits, now picked from the CNBV catalog. Error: "La clave de localidad lleva 8 dígitos."
- **Domicilio:** free text. [propuesto] Split into the same structured address as General.

**Branch form [propuesto] additions:** teléfono, horario, responsable de sucursal (select of usuarios).

**Baja rules [demo]:**
- Branches are never deleted (their operations keep them).
- Can't deactivate one with assigned staff: "La sucursal tiene {n} empleado(s) asignado(s): cámbielos de sucursal antes de darla de baja."
- At least one branch must stay active: "Debe quedar al menos una sucursal activa."

**Branch detail tabs:** General (the fields) · Cajas (its drawers/vault, read-only, from `caja`) · Usuarios (staff assigned) · Auditoría.

## Tab: Auditoría
The `01` audit-trail table for the negocio record **and** its branches (alta, edits before → after, baja/reactivación, documentos), filterable by "Negocio / Sucursal". Fixtures in Phase 1, then an entry for each change made in the app.

## Fixtures (Phase 1)
- One centro cambiario: invented, clearly fake data (e.g. "Centro Cambiario Demo, S.A. de C.V."), with valid-format keys.
- Three branches in different entidades with real CNBV localidad keys, one of them in Baja.

## Decisions (2026-11-13, round 2)
| Topic | Decision |
|---|---|
| Currency keys | **ISO 4217** (`divisas.json`), see `03` D-18. |
| [propuesto] fields | **Accepted for the demo.** Product-owner review of the legal fields happens **later**, before production. |
| Fixture identity | **Made-up name** ("Centro Cambiario Demo, S.A. de C.V."). |

## OPEN: needs the lead's call
None in this file. (Deferred: product-owner review of the [propuesto] legal fields.)

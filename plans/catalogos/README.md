# Catálogos oficiales (CNBV / UIF) para centros cambiarios

Consultado el 2026-11-13. Cada JSON tiene la forma `{ "fuente": {...}, "registros": [ { "clave", "descripcion", ... } ] }`. Las claves y descripciones se copiaron literalmente (UTF-8, mayúsculas y faltas de acento del original incluidas). Solo se quitaron espacios al inicio y al final. Todas las claves son strings.

## De dónde salen

**Fundamento.** Las DCG de los centros cambiarios son las *Disposiciones de carácter general a que se refiere el artículo **95 Bis** de la LGOAAC aplicables a los centros cambiarios a que se refiere el artículo 81-A* (DOF 10-04-2012 y reformas; la última que lista la CNBV es la del DOF 20-03-2019). El artículo 95 sin "Bis" corresponde a las casas de cambio. Los formatos de reporte los expide la SHCP (UIF). La CNBV distribuye los catálogos y recibe los reportes por el SITI PLD/FT.

**Página oficial de descarga:** https://www.gob.mx/cnbv/acciones-y-programas/disposiciones-legales-centros-cambiarios, sección "Catálogos": *"Se dan a conocer los catálogos para los diferentes reportes en materia de PLD/FT"*.

| Paquete | URL | Fecha | SHA-256 |
|---|---|---|---|
| **Catálogos 2019** (vigente, el que enlaza la página) | https://www.cnbv.gob.mx/PrevencionDeLavadoDeDinero/Documents/CATALOGO_CENTROSCAMBIARIOS_2019.zip | ZIP Last-Modified 2019-07-15; archivos internos del 17-06-2019 | `d82481d8…cc084` |
| Catálogos anteriores (solo se usaron para columnas complementarias) | https://www.cnbv.gob.mx/PrevencionDeLavadoDeDinero/Documents/CATALOGO_CENTROS%20CAMBIARIOS.zip | Last-Modified 2017-03-16 | `48148c3b…5ff7f` |

Archivos del paquete 2019 y el reporte al que sirve cada uno:
- `CATALOGOS RIPS F41.xlsx` es el **Reporte de operaciones relevantes, inusuales y preocupantes** (formato de 41 columnas). Fuente: Resolución SHCP, DOF 14-12-2004, reformada el 18-05-2005, 25-10-2010, 08-06-2012 y 01-08-2013. Compilado: https://www.gob.mx/cms/uploads/attachment/file/618089/Formato_41_Campos_Compilado.pdf (copia en pld.hacienda.gob.mx).
- `CATALOGOS FDE-FD1 (Dólares Efectivo).xlsx` es el **Reporte de operaciones con dólares en efectivo** (XML). Fuente: Resolución SHCP, DOF 06-02-2015 (https://dof.gob.mx/nota_detalle.php?codigo=5381124&fecha=06/02/2015). Aplica expresamente a centros cambiarios.
- `CATALOGOS DE1 (Montos Totales).xlsx` es el **Reporte de montos totales de divisas** de centros cambiarios. Fuente: DOF 16-07-2014 (https://dof.gob.mx/nota_detalle.php?codigo=5352627&fecha=16/07/2014).
- `CATALOGO _CAPACITACION.xlsx` es el informe de cursos de capacitación. No se relaciona con clientes ni operaciones y no se convirtió.

Licencia o términos: ni los archivos ni la página de descarga indican ninguna.

## Catálogos generados

| Archivo | Nombre oficial (hoja · archivo) | Organismo | Filas | Campo que alimenta | Catálogo demo que reemplaza y cómo mapea |
|---|---|---|---|---|---|
| `paises.json` | PAIS · RIPS F41 **+** PAIS · FDE-FD1 (unión; los flags `enReporteOperaciones` / `enReporteDolares` dicen en cuál está) | CNBV/UIF | 252 (245 RIPS, 251 FDE) | Nacionalidad y país de nacimiento (PF), nacionalidad (PM), país del domicilio extranjero. Columna 15 RIPS. `pais_nacimiento`, `pais_nacionalidad` y `<pais>` en dólares | PAISES (ISO 3166-1, 250 filas, todos BAJO). Claves de 2 letras parecidas a ISO, pero **no idénticas**: ver "Para decidir" #1. Sin `grado`. |
| `entidades.json` | ENTIDAD_FEDERATIVA · FDE-FD1 | CNBV/UIF | 32 | Entidad del domicilio nacional (`<entidad_federativa>` del reporte de dólares) | ENTIDADES (RENAPO 2 letras + NE). **Esquema distinto**: numérico 01–32 (09 DISTRITO FEDERAL, 15 MEXICO), sin "nacido en el extranjero". Ver "Para decidir" #2. |
| `municipios.json` | DELEGACION_MUNICIPIO · FDE-FD1 | CNBV/UIF | 2,457 | Delegación o municipio del domicilio nacional (`<delegacion_municipio>`, "Catálogo de Delegación o Municipio SEPOMEX") | El demo no tiene equivalente. `claveEntidad` son los 2 primeros dígitos, regla del instructivo. |
| `localidades.json` | LOCALIDAD · RIPS F41 | CNBV/UIF | 3,689 | Columna 6 LOCALIDAD (sucursal donde se operó) y columna 26 CIUDAD O POBLACIÓN (domicilio del cliente) del reporte de 41 columnas | LOCALIDADES (1 fila de ejemplo). **`01001002` existe**: "DISTRITO FEDERAL, DF". La columna `estado` es el nombre del estado o país y viene del paquete 2017 (no existe en 2019). No trae clave RENAPO de entidad. Ver "Para decidir" #3. |
| `actividades-economicas.json` | ACTIVIDAD_ECONOMICA · RIPS F41 | CNBV/UIF | 1,172 | Columna 28 ACTIVIDAD ECONÓMICA (PF y PM) | OCUPACIONES (26 claves propias con grado). No hay mapeo 1:1. Ver "Para decidir" #4. |
| `actividades-economicas-dolares.json` | ACTIVIDAD_ECONOMICA · FDE-FD1 | CNBV/UIF | 1,262 | PF `<actividad_economica>`: "actividad económica, ocupación, profesión, actividad o giro del negocio" | OCUPACIONES. Agrega 91 claves que no están en RIPS, entre ellas el bloque 98xxxxx de cargos públicos (Presidente, senador, gobernador, juez…) y giros de riesgo (1330001 extracción de oro, 3900001 joyería, 6800001 venta de vehículos…). |
| `giros-mercantiles.json` | GIRO_MERCANTIL · FDE-FD1 | CNBV/UIF | 1,193 | PM `<giro_mercantil>`: "giro mercantil, actividad u objeto social" | Giro de PM (el demo usa OCUPACIONES). Es ACTIVIDAD_ECONOMICA de FDE sin 69 claves de persona física: las 63 del bloque 98xxxxx (cargos públicos) y 9900904–9900909 (estudiante, desempleado, jubilado, pensionado, ama de casa, ministro de culto). |
| `divisas.json` | MONEDA · DE1 (idéntica a MONEDA · FDE-FD1) | CNBV/UIF | 194 | Moneda operada en montos totales y en el reporte de dólares | DIVISAS (USD, EUR, CAD, GBP, JPY, CHF). **Las 6 claves existen con el mismo código ISO 4217.** `pais` viene de `CatalogoMonedaMT.xlsx` (2017), que tiene las mismas 194 claves y descripciones. |
| `monedas-reporte-operaciones.json` | MONEDA · RIPS F41 | CNBV/UIF | 123 | Columna 12 MONEDA del reporte de 41 columnas | DIVISAS. Claves heredadas: **USD no existe (el dólar es `2`)** y **GBP no existe (la libra es `STG`)**. Ver "Para decidir" #5. `pais` viene del paquete 2017. |
| `instrumentos-monetarios.json` | INSTRUMENTO_MONETARIO · RIPS F41 | CNBV/UIF | 10 | Columna 9 (operaciones) | Sin equivalente en el demo (módulo de operaciones). |
| `instrumentos-monetarios-dolares.json` | INSTRUMENTO_MONETARIO · FDE-FD1 | CNBV/UIF | 9 | `<instrumento_monetario>` (siempre 1 EFECTIVO) e `<instrumento_monetario_liquidacion>` | Sin equivalente. |
| `tipos-operacion.json` | TIPO_OPERACION · RIPS F41 | CNBV/UIF | 40 | Columna 8 (para centro cambiario: 03 COMPRA DIVISAS, 04 VENTA DIVISAS) | Sin equivalente (módulo de operaciones). |
| `tipos-operacion-dolares.json` | TIPO_OPERACION · FDE-FD1 | CNBV/UIF | 10 | `<tipo_operacion>` (13 COMPRA DIVISAS…) | Sin equivalente. |
| `tipos-identificacion-dolares.json` | TIPO_IDENTIFICACION · FDE-FD1 | CNBV/UIF | 4 (**parcial**) | Ningún campo del layout del DOF 06-02-2015 lo cita (lo busqué en el texto). La hoja viene en el paquete. | TIPOS_IDENTIFICACION (13). Solo 1 CREDENCIAL PARA VOTAR, 2 PASAPORTE, 5 CERTIFICADO DE MATRÍCULA CONSULAR y 13 DOCUMENTO DEL INM. **No sirve como catálogo completo**. |
| `tipos-reporte.json` | TIPO_REPORTE · RIPS F41 | CNBV/UIF | 3 | Columna 1 | Sin equivalente. |
| `tipos-persona.json` | Columna 16 TIPO DE PERSONA, transcrita del PDF de la Resolución (no hay hoja Excel) | SHCP/UIF | 2 | Columna 16: `1` = Persona Física, `2` = Persona Moral | El tipo de persona del demo (PF/PM). Mapeo directo, con otra clave. |

**No convertidos, pero oficiales** (están en el paquete 2017 "anteriores" y faltan en el de 2019): `CODIGO_POSTAL` (120,560 filas CP → entidad, sirve para validar que el CP de la sucursal corresponda a su entidad) y `ORGANISMO_SUPERVISOR` (002 CNBV, 003 CNSF, 004 CONSAR, 007 SAT). Puedo convertirlos si se necesitan.

**Defectos del original que se conservaron tal cual:** caracteres perdidos (`BRISE AS DE MATAMOROS, MICH`, `ESPA A`). Siete descripciones de actividad (95xxxxx, 9900003) llevan el sufijo "(U.I.F)" en RIPS pero no en FDE. La única fila nueva de LOCALIDAD en 2019, `00903001 COYOACAN`, cae en el rango de claves de Chihuahua (`009…`), aunque Coyoacán es de la CDMX. Es probable que sea un error del archivo; no se corrigió.

**Banxico:** ~~no hay catálogo de Banxico que aplique~~. Superado por la decisión del lead (2026-11-13, `03` D-18): las divisas usan claves **ISO 4217** (`divisas.json`); los catálogos de Banxico quedan como referencia. Ver la sección "Divisas (Banxico)" abajo. Ninguno de esos documentos va dirigido a centros cambiarios, así que usar claves de Banxico es decisión del proyecto, no un requisito regulatorio.

## No official source found

| Catálogo demo | Qué busqué | Resultado |
|---|---|---|
| ENTIDADES con claves **RENAPO** de 2 letras + `NE` | Instructivo Normativo para la Asignación de la CURP (DOF 18-06-2018, mod. 18-10-2021) y las Reglas para la ejecución de los procedimientos de asignación de la CURP (https://www.gob.mx/cms/uploads/attachment/file/681698/reglas_para_la_ejecucion_de_los_procedimientos_asignacion_de_la_curp.pdf) | El Instructivo remite al "catálogo para la conformación de la CURP" (posiciones 12–13). Las Reglas lo listan como **Anexo 03 "Catálogo de Entidades Federativas para la conformación de la CURP"**, pero el PDF publicado no incluye los anexos. No encontré una versión descargable. **No se generó**: no se transcribieron claves de memoria. |
| ORIGEN_RECURSOS / DESTINO_RECURSOS | Paquetes de catálogos CNBV 2019 y 2017, y layouts RIPS y dólares | No hay catálogo ni campo con claves. Las DCG piden el dato, pero no definen claves. |
| ANTECEDENTES | Igual que arriba | Sin catálogo oficial: es un criterio interno de la matriz de riesgo. |
| CONDICION_PEP / tipo PEP | Igual que arriba | Sin catálogo oficial de condición PEP. Lo más cercano es el bloque 98xxxxx (cargos públicos) de `actividades-economicas-dolares.json`, que es una ocupación y no una condición PEP. |
| TIPOS_IDENTIFICACION (13 filas, con flags) | Paquetes CNBV | Solo existe el parcial de 4 claves (`tipos-identificacion-dolares.json`). La lista completa de identificaciones válidas está en el texto de las DCG, no en un catálogo con claves. |
| `grado` (BAJO/MEDIO/ALTO) por entrada de catálogo | Paquetes CNBV | Ningún catálogo oficial trae grado de riesgo. Es propio de la metodología de cada sujeto obligado. |
| Género (H/M/X), condición de estancia, cargos de representante, criterio de propietario real, cuenta propia | Layouts RIPS (2004/2013) y dólares (2015) | No hay catálogo con claves para estos campos en los reportes del centro cambiario. |

## Para decidir

1. **Claves de país.** El catálogo oficial usa 2 letras, pero difiere de ISO 3166-1 en el demo (250 filas) en estas claves: el oficial usa `UK` (demo `GB`) y `EL` para Grecia (demo `GR`), le faltan `BQ` y `MF`, y agrega `AN` Antillas Neerlandesas, `CP` Clipperton, `IC` Islas Canarias (solo en FDE), `ND` SE DESCONOCE (solo en RIPS) y `XK` Kosovo (solo en FDE). Descripciones en mayúsculas y sin acentos.
   - a) Usar las claves oficiales como clave del catálogo.
   - b) Conservar ISO y guardar un mapeo a la clave oficial para los reportes.
   - c) Guardar ambas claves por fila.
2. **Entidades federativas.** El reporte oficial usa claves numéricas 01–32 y no tiene `NE`. La CURP (cálculo y autollenado) necesita las letras RENAPO, y para esas no encontré una fuente oficial descargable.
   - a) Dos catálogos: RENAPO para entidad de nacimiento/CURP y CNBV numérico para domicilio.
   - b) Un catálogo CNBV numérico con una columna RENAPO, que necesitaría una fuente oficial para esa columna.
   - c) Mantener RENAPO y no usar el numérico hasta que exista un módulo de reportes.
3. **Localidades.** El catálogo oficial tiene 3,689 claves y **también localidades extranjeras** (EUA, España, etc.). El demo guarda `dom_localidad` en null cuando el país no es MX, y amarra la localidad a una entidad RENAPO (`entidad = DF`). El oficial solo trae el nombre del estado (columna `estado`, del paquete 2017).
   - a) Filtrar a localidades mexicanas y mantener null para extranjeros.
   - b) Permitir localidad extranjera.
   - c) Cómo relacionar la localidad con la entidad: por el nombre `estado`, con un mapeo propio, o sin relación.
   - d) Además: el ejemplo del demo dice "CIUDAD DE MÉXICO" y el oficial dice "DISTRITO FEDERAL, DF".
4. **Ocupación / actividad / giro.** Hay tres catálogos oficiales: RIPS (1,172, PF y PM), dólares PF (1,262) y dólares PM giro (1,193). Las claves de 7 dígitos son incompatibles con las 26 claves con grado del demo.
   - a) Reemplazar OCUPACIONES por el catálogo oficial y asignar `grado` por clave o por rango.
   - b) Conservar la lista corta del demo para la UI y mapear cada entrada a una clave oficial.
   - c) Cuál de los tres usar para PF y cuál para PM (RIPS es uno solo para ambos; dólares separa PF y PM).
5. **Divisas.** `divisas.json` (DE1/dólares, ISO) contiene USD, EUR, CAD, GBP, JPY y CHF tal cual. La columna MONEDA del reporte de 41 columnas usa otro catálogo, donde USD es `2` y GBP es `STG`.
   - a) Guardar ISO y traducir al generar el reporte RIPS.
   - b) Guardar ambas claves.
   - c) Además: qué subconjunto de las 194 se ofrece en la UI.
6. **Tipos de identificación.** El único catálogo oficial tiene 4 claves con numeración no consecutiva (1, 2, 5, 13) y no está ligado a un campo del layout publicado.
   - a) Mantener la lista del demo, que se basa en el texto de las DCG.
   - b) Adoptar las claves oficiales para las 4 que coinciden y conservar claves propias para el resto.
7. **Vigencia.** El paquete 2019 es el más reciente que publica la CNBV (página consultada el 2026-11-13), pero tiene más de 7 años. El Acuerdo de simplificación de la CNBV de mayo de 2026 (unifica la cuenta SITI PLD/FT, homoclave CNBV-2026-001) no cambia formatos ni catálogos. Hay que decidir si se acepta el paquete 2019 como fuente o si se pide a la CNBV/SITI una versión actual antes de producción.

## Divisas (Banxico)

Consultado el 2026-11-13. Banxico **no publica un catálogo único de claves de divisas**. Encontré tres esquemas de clave en documentos de Banxico más un indicador de moneda nacional o extranjera. Cada uno se convirtió a su propio JSON y no se eligió entre ellos (ver "Para decidir" abajo). Que el primero se llame `divisas-banxico.json` no implica que sea el elegido.

| Archivo | Fuente Banxico | Filas | Esquema de clave | MXN | USD | EUR | JPY | CNY | KRW |
|---|---|---|---|---|---|---|---|---|---|
| `divisas-banxico.json` | **SIE**, cuadro CF336 "Tipos de cambio para revalorización de balance del Banco de México" (directorio: "Tipos de cambio de otras divisas"), agrupador "Países (Clave / Divisa)". Series de cierre de jornada del CF909. https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?sector=6&accion=consultarCuadro&idCuadro=CF336&locale=es | 69 (68 claves distintas) | 3 letras tomadas del rótulo "País (CLAVE / Divisa)". Cada fila trae los ids de serie del SIE | no (es la base, "Tipo en pesos") | sí | sí | sí | sí | sí |
| `divisas-banxico-aclme-ventanilla.json` | Formulario **ACLME-PD** (Banca Múltiple), "CATÁLOGO DE DIVISAS DE LA SECCIÓN IX" (tipos de cambio de compra y venta ofrecidos al público en ventanilla, por sucursal), págs. 102-103. https://www.banxico.org.mx/waFormularios/WEB/ACLMEPDAyudasGenericasCompleto.pdf ("Agosto 2023") | 160 | 3 letras con forma ISO 4217, en una edición vieja | sí ("Peso Mexicano") | sí | sí | sí | sí | sí |
| `divisas-banxico-aclme-operaciones.json` | "CATÁLOGO DE DIVISAS DE LA SECCIÓN VIII DEL FORMULARIO ACLME-PD" (pág. 101), idéntico a la Sección V del **ACLME-PDBD** (Banca de Desarrollo, "Enero 2026", pág. 44, https://www.banxico.org.mx/waFormularios/WEB/ACLMEPDBDAyudasGenericasCompleto.pdf) | 11 | ISO para 10 divisas más `OTD` "OTRAS DIVISAS" | no | sí | sí | sí | no (va en OTD) | no (va en OTD) |
| `monedas-banxico-aclme-casas-cambio.json` | Formulario **ACLME-PDCC** (Casas de Cambio, "Enero 2026"), campo Moneda Carácter (3). https://www.banxico.org.mx/waFormularios/WEB/ACLMEPDCCAyudasGenericasCompleto.pdf | 2 | `MXP` moneda nacional y `FEX` moneda extranjera. **No identifica la divisa** | (MXP) | – | – | – | – | – |

**SIE (`divisas-banxico.json`).** Columnas: `clave`, `descripcion` (la divisa sin la llamada de nota), `pais`, `etiquetaSIE` (rótulo literal), `nota`, las series mensuales `serieDolaresPorDivisa` y `serieTipoEnPesos` (CF336), las mismas con sufijo `CierreJornada` (CF909) y `monedaDOF`. Algunas filas traen series diarias:
- `serieDiariaCF307`: pesos por divisa, del cuadro CF307 "Cotización de las divisas que conforman la canasta del DEG…". Existe para USD SF46405, EUR SF46410, JPY SF46406, GBP SF46407, CNY SF290383 y XDR SF46411. CF307 nombra las series solo como "Yuan chino", "Euro", etc., así que el cruce con la clave se hizo por nombre.
- `serieFIX` SF43718 y `serieFIXFechaLiquidacion` SF60653, del CF102. Solo para el USD de EUA.

Para **KRW no hay serie diaria**: Banxico solo publica el won mensual (CF336/CF909), expresado en dólares por **mil** wones (nota 3/). Los 69 renglones son los mismos de la publicación legal mensual *Equivalencia de las monedas de diversos países con el dólar de los EE.UU.A.* (art. 20 CFF; la de octubre de 2026 salió en el DOF del 06-11-2026: https://sidof.segob.gob.mx/notas/5803169). Esa publicación **no trae claves**, solo País y Moneda. Su columna Moneda se guardó literal en `monedaDOF` y difiere en grafía en 5 casos: Florín/Forint, Hryvnia/Hryvna, Córdoba/Cordoba, Guaraní/Guarani y DEG/Deg.

**En qué se aparta cada esquema de ISO 4217:**
- SIE: `CNH` (yuan extracontinental, código de mercado, no ISO), `ESD` (Ecuador, ISO `USD`), `NIC` (Nicaragua, ISO `NIO`) y `UYP` (Uruguay, ISO `UYU`). `USD` se repite para Estados Unidos de América y para Puerto Rico, así que **la clave no es única**. `XDR` (DEG) y `VES` sí son ISO.
- ACLME-PD Sección IX: todas tienen forma ISO, pero el catálogo conserva códigos que ISO ya retiró (`VEF`, `STD`, `MRO`, `ZWL`, `BYR`, `HRK`, `SLL`, `CUC`) y no trae sus reemplazos (`VES`, `STN`, `MRU`, `ZWG`, `BYN`, `SLE`). También trae `CHE`, `CHW` y `XSU`.
- ACLME-PD Sección VIII / PDBD Sección V: `OTD` es una clave propia de Banxico.
- ACLME-PDCC: `MXP`/`FEX` son claves propias de Banxico.

**Contra los catálogos CNBV que ya están aquí:**
- `divisas.json` (CNBV DE1/FDE, 194, ISO): contiene todas las claves del SIE salvo `CNH`, `ESD`, `NIC`, `UYP` y `VES`. Frente a la Sección IX: DE1 trae además 37 claves (monedas metálicas `MXA`…`MXZ`, metales `XAU`/`XAG`/`XPT`/`XPD`, `XDR`, `CLF`, `UYI`, `USN`/`USS`, las retiradas `EEK`/`LTL`/`LVL`/`ZMK`…), y la Sección IX trae 3 que DE1 no tiene: `SSP`, `XSU` y `ZMW`. Las descripciones de DE1 están en inglés y mayúsculas; las de Banxico, en español.
- `monedas-reporte-operaciones.json` (CNBV F41, 123): **comparte con el SIE las claves heredadas `NIC` y `UYP`**, lo que sugiere que el catálogo F41 viene de una lista de Banxico. Las diferencias principales: F41 usa `2` para el dólar (no `USD`) y `STG` para la libra (no `GBP`), y conserva monedas pre-euro y claves numéricas. Del SIE le faltan 16 claves, entre ellas `USD`, `GBP`, `BRL`, `ARS`, `RUB`, `TRY`, `CNH`, `ESD` y `VES`.

**Contexto regulatorio.** Ninguno de estos documentos va dirigido a los centros cambiarios. El SIE y el DOF son publicaciones estadísticas y fiscales. ACLME-PD/PDBD son reportes de bancos y ACLME-PDCC de casas de cambio a Banxico (art. 36 de la Ley del Banco de México). Lo que dice arriba la nota "Banxico" sigue siendo cierto: los centros cambiarios reportan a la CNBV/UIF. El catálogo de Banxico se adopta aquí por decisión del proyecto, no por obligación regulatoria.

**Qué más busqué y no sirvió como catálogo:**
- Formulario OCIME (captación en moneda extranjera): remite a un "Catálogo de Monedas" en su "Anexo E", pero el PDF publicado (https://www.banxico.org.mx/waFormularios/WEB/OCIMEAyudasGenericasCompleto.pdf, dic-2024) no incluye ese anexo y no encontré el anexo por separado.
- CF102 (FIX): solo cubre el dólar.
- Portal tipcamb: no tiene lista propia.
- SIE API (`SieAPIRest`): requiere token y usa los mismos ids de serie.

SHA-256 de lo descargado: ACLME-PD `1168cd83…b768a`, ACLME-PDBD `adab4991…cb382b`, ACLME-PDCC `7a1a8ceb…d280`. Las páginas SIE CF336, CF909 y el texto del DOF se consultaron el 2026-11-13.

### Decidido (divisas, 2026-11-13)

El lead decidió **claves ISO 4217**. El catálogo de divisas de la app es `divisas.json` (CNBV DE1/FDE, ISO). Con ISO, los puntos 2–5 de abajo se resuelven solos: sin duplicado USD, el renminbi es `CNY` (`CNH` no es ISO), `KRW` y `MXN` son claves ISO. Los JSON de Banxico quedan solo como referencia (p. ej. para ubicar la serie SIE de una divisa).

### Para decidir (divisas Banxico) — superado por la decisión de arriba

1. **Qué esquema Banxico usar como clave del catálogo de divisas:**
   - a) **SIE CF336** (`divisas-banxico.json`): es la lista de divisas que Banxico cotiza y publica (69 renglones, igual a la del DOF) y trae las series para jalar tipos de cambio. Tiene claves no ISO (`ESD`, `NIC`, `UYP`, `CNH`), la clave `USD` repetida (EUA y Puerto Rico) y no tiene renglón MXN.
   - b) **ACLME-PD Sección IX** (`divisas-banxico-aclme-ventanilla.json`): es el catálogo regulatorio que Banxico usa justo para tipos de cambio de ventanilla al público (el caso de uso de un centro cambiario). Trae MXN y las 6 monedas de la app, pero está desactualizado frente a ISO (VEF, HRK, SLL…) y es de agosto de 2023.
   - c) **ACLME-PD VIII / PDBD V** (11 claves con OTD): no cubre CNY ni KRW.
   - d) Combinar: clave de la Sección IX (o ISO) más la serie SIE como columna para cotizar.
2. **Duplicado USD en el SIE** (EUA / Puerto Rico): si se usa el SIE como catálogo, hay que decidir si Puerto Rico se descarta o si la llave es `pais + clave`.
3. **CNY vs CNH**: el SIE publica el yuan continental (`CNY`) y el extracontinental (`CNH`). La app dice "renminbi". Hay que definir cuál se opera o se cotiza.
4. **KRW sin cotización diaria**: Banxico solo publica el won mensual (en dólares por mil wones). Si la app necesita un tipo de cambio diario de referencia para KRW, Banxico no lo da.
5. **MXN**: solo la Sección IX lo tiene como `MXN`. El SIE no tiene renglón para el peso, y ACLME-PDCC usa `MXP` como indicador de moneda nacional. Hay que decidir qué clave lleva la moneda base.

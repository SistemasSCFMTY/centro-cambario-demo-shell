/** One edited field of an audit entry, shown as `antes → después`. */
export interface CambioAuditoria {
  campo: string;
  antes: string | null;
  despues: string | null;
}

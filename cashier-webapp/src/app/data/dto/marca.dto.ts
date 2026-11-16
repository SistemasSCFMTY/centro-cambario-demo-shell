/** Tenant branding as the API will return it (Phase 1: fixture). Colors are 500 bases, `#rrggbb`. */
export interface MarcaDto {
  nombre: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  colorPrimario: string;
  colorAcento: string;
}

import { DesvanecidoDesplazamiento } from '@components/desvanecido-desplazamiento/desvanecido-desplazamiento';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CuadriculaCampos } from '@components/cuadricula-campos/cuadricula-campos';
import { PillEstatus } from '@components/pill-estatus/pill-estatus';
import {
  AVISO_REPORTES_OFICIALES,
  DIAS_AVISO_VIGENCIA,
  ETIQUETA_DOCUMENTO_LEGAL,
} from '@data/constants/negocio.constants';
import { PerfilNegocioDto } from '@data/dto/negocio-perfil.dto';
import { AjustePill } from '@data/interfaces/ajuste-pill';
import { SeccionDetalleNegocio } from '@data/interfaces/seccion-detalle-negocio';
import { OpcionesNegocio } from '@data/interfaces/opciones-negocio';
import { FechaPipe } from '@pipes/fecha.pipe';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye } from '@ng-icons/lucide';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { formatearFecha, hoyIso } from '@utils/fechas/fechas';

/** The Legal tab (plans/04): claves for the official reports, registro, constitución, representante, Oficial de Cumplimiento and documents. */
@Component({
  selector: 'app-negocio-legal',
  imports: [
    CuadriculaCampos,
    DesvanecidoDesplazamiento,
    FechaPipe,
    HlmTableImports,
    NgIcon,
    PillEstatus,
  ],
  providers: [provideIcons({ lucideEye })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './negocio-legal.html',
  host: { class: 'block' },
})
export class NegocioLegal {
  readonly perfil = input.required<PerfilNegocioDto>();
  readonly opciones = input<OpcionesNegocio | null>(null);

  protected readonly claves = computed(() => {
    const legal = this.perfil().legal;
    return [
      {
        dato: 'Clave del órgano supervisor (CASFIM)',
        valor: legal.claveOrganoSupervisor,
        fundamento: 'Formato oficial, columna 4',
      },
      {
        dato: 'Clave del centro cambiario',
        valor: legal.claveCentro,
        fundamento: 'Formato oficial, columna 5',
      },
      {
        dato: 'Clave de la entidad (CASFIM)',
        valor: legal.claveEntidad,
        fundamento: 'Reporte de dólares (.FDE)',
      },
    ];
  });

  protected readonly secciones = computed<SeccionDetalleNegocio[]>(() => {
    const legal = this.perfil().legal;
    const oficial = this.opciones()?.usuarios.find((u) => u.clave === legal.oficialUsuarioId);
    return [
      {
        id: 'registro',
        titulo: 'Registro y autorización',
        campos: [
          { etiqueta: 'Número de registro', valor: legal.numeroRegistro, dato: true },
          { etiqueta: 'Fecha de registro', valor: formatearFecha(legal.fechaRegistro), dato: true },
          { etiqueta: 'Dictamen técnico: número', valor: legal.dictamenNumero, dato: true },
          {
            etiqueta: 'Dictamen técnico: emisión',
            valor: formatearFecha(legal.dictamenEmision),
            dato: true,
          },
          {
            etiqueta: 'Dictamen técnico: vigencia',
            valor: formatearFecha(legal.dictamenVigencia),
            dato: true,
          },
          { etiqueta: 'Estado del dictamen', pill: this.estadoDictamen(legal.dictamenVigencia) },
        ],
      },
      {
        id: 'constitucion',
        titulo: 'Constitución',
        campos: [
          { etiqueta: 'Escritura constitutiva', valor: legal.escrituraNumero, dato: true },
          {
            etiqueta: 'Fecha de la escritura',
            valor: formatearFecha(legal.escrituraFecha),
            dato: true,
          },
          { etiqueta: 'Notario', valor: legal.notarioNombre },
          { etiqueta: 'Número de notaría', valor: legal.notarioNumero, dato: true },
          { etiqueta: 'Entidad de la notaría', valor: legal.notarioEntidad },
          { etiqueta: 'Folio mercantil', valor: legal.folioMercantil, dato: true },
        ],
      },
      {
        id: 'representante',
        titulo: 'Representante legal',
        campos: [
          { etiqueta: 'Nombre completo', valor: legal.representanteNombre },
          { etiqueta: 'RFC', valor: legal.representanteRfc, dato: true },
          { etiqueta: 'CURP', valor: legal.representanteCurp, dato: true },
          { etiqueta: 'Poder: escritura', valor: legal.poderEscrituraNumero, dato: true },
          { etiqueta: 'Poder: fecha', valor: formatearFecha(legal.poderFecha), dato: true },
          { etiqueta: 'Poder: notario', valor: legal.poderNotario },
        ],
      },
      {
        id: 'oficial',
        titulo: 'Oficial de Cumplimiento',
        campos: [
          { etiqueta: 'Usuario designado', valor: oficial?.etiqueta },
          {
            etiqueta: 'Fecha de designación',
            valor: formatearFecha(legal.oficialFechaDesignacion),
            dato: true,
          },
          {
            etiqueta: 'Notificación a la autoridad',
            valor: formatearFecha(legal.oficialFechaNotificacion),
            dato: true,
          },
        ],
      },
    ];
  });

  protected readonly documentos = computed(() =>
    this.perfil().documentos.map((documento) => ({
      ...documento,
      etiqueta: ETIQUETA_DOCUMENTO_LEGAL[documento.tipo],
      tamano: this.formatearTamano(documento.tamanoKb),
    })),
  );

  protected readonly aviso = AVISO_REPORTES_OFICIALES;
  protected readonly pillPendiente: AjustePill = { tono: 'warning', etiqueta: 'Pendiente' };

  private estadoDictamen(vigencia: string | null): AjustePill | undefined {
    if (!vigencia) return undefined;
    const dias = this.diasHasta(vigencia);
    if (dias < 0) return { tono: 'danger', etiqueta: 'Vencido' };
    if (dias < DIAS_AVISO_VIGENCIA) {
      return { tono: 'warning', etiqueta: `Vence en ${dias} ${dias === 1 ? 'día' : 'días'}` };
    }
    return { tono: 'success', etiqueta: 'Vigente' };
  }

  private diasHasta(iso: string): number {
    const partes = (fecha: string) => fecha.slice(0, 10).split('-').map(Number);
    const [a, m, d] = partes(iso);
    const [ha, hm, hd] = partes(hoyIso());
    return Math.round((Date.UTC(a, m - 1, d) - Date.UTC(ha, hm - 1, hd)) / 86_400_000);
  }

  private formatearTamano(kb: number | null): string | null {
    if (kb === null) return null;
    return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
  }
}

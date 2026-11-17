import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CuadriculaCampos } from '@components/cuadricula-campos/cuadricula-campos';
import { PerfilNegocioDto } from '@data/dto/negocio-perfil.dto';
import { SeccionDetalleNegocio } from '@data/interfaces/seccion-detalle-negocio';
import { OpcionesNegocio } from '@data/interfaces/opciones-negocio';
import { formatearMonto } from '@utils/dinero/formato-dinero';
import { formatearFecha } from '@utils/fechas/fechas';

/** The General tab (plans/04): identidad, domicilio fiscal, contacto and operación, as field grids. */
@Component({
  selector: 'app-negocio-general',
  imports: [CuadriculaCampos],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './negocio-general.html',
  host: { class: 'block' },
})
export class NegocioGeneral {
  readonly perfil = input.required<PerfilNegocioDto>();
  readonly opciones = input<OpcionesNegocio | null>(null);

  protected readonly secciones = computed<SeccionDetalleNegocio[]>(() => {
    const centro = this.perfil().centro;
    const matriz = this.opciones()?.sucursales.find((s) => s.clave === centro.sucursalMatrizId);
    const calle = [centro.calle, centro.numeroExterior, centro.numeroInterior]
      .filter((parte) => !!parte)
      .join(' ');
    const localidad = [centro.localidadDescripcion, centro.localidad && `(${centro.localidad})`]
      .filter((parte) => !!parte)
      .join(' ');
    return [
      {
        id: 'identidad',
        titulo: 'Identidad',
        campos: [
          { etiqueta: 'Nombre comercial', valor: centro.nombreComercial },
          { etiqueta: 'Denominación o razón social', valor: centro.razonSocial },
          { etiqueta: 'RFC', valor: centro.rfc, dato: true },
          {
            etiqueta: 'Inicio de operaciones',
            valor: formatearFecha(centro.inicioOperaciones),
            dato: true,
          },
          { etiqueta: 'Sucursal matriz', valor: matriz?.etiqueta },
        ],
      },
      {
        id: 'domicilio',
        titulo: 'Domicilio fiscal',
        campos: [
          { etiqueta: 'Calle y número', valor: calle },
          { etiqueta: 'Colonia', valor: centro.colonia },
          { etiqueta: 'Código postal', valor: centro.codigoPostal, dato: true },
          { etiqueta: 'Entidad federativa', valor: centro.entidad },
          { etiqueta: 'Municipio o alcaldía', valor: centro.municipio },
          { etiqueta: 'Localidad', valor: localidad },
        ],
      },
      {
        id: 'contacto',
        titulo: 'Contacto',
        campos: [
          { etiqueta: 'Teléfono', valor: centro.telefono, dato: true },
          { etiqueta: 'Correo electrónico', valor: centro.correo },
          { etiqueta: 'Sitio web', valor: centro.sitioWeb },
          { etiqueta: 'Horario de atención', valor: centro.horario },
        ],
      },
      {
        id: 'operacion',
        titulo: 'Operación',
        campos: [
          { etiqueta: 'Divisas que opera', valor: centro.divisas.join(', '), dato: true },
          {
            etiqueta: 'Límite diario por cliente',
            valor: formatearMonto(centro.limiteDiarioUsd, 'USD'),
            dato: true,
          },
        ],
      },
    ];
  });
}

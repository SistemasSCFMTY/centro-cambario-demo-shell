import { HttpRequest } from '@angular/common/http';
import { RUTAS_CATALOGOS } from '@data/constants/catalogos.constants';
import { CAJEROS } from '@data/fixtures/cajeros.fixture';
import { DIVISAS } from '@data/fixtures/divisas.fixture';
import { ManejadorApi } from '@data/interfaces/manejador-api';
import {
  cargarLocalidades,
  cargarMunicipios,
} from '@interceptors/simulacion-api/catalogos-geograficos';
import { sucursalesActuales } from '@interceptors/simulacion-api/manejadores/negocio.manejador';
import { parametrosPlanos, responderOk } from '@interceptors/simulacion-api/respuestas';
import { RespuestaSimulada } from '@data/types/simulacion.types';
import { localidadesDeEntidad, municipiosDeEntidad } from '@utils/catalogos/geografia';

async function municipios(solicitud: HttpRequest<unknown>) {
  const { entidad = '' } = parametrosPlanos(solicitud);
  return responderOk(solicitud, municipiosDeEntidad(await cargarMunicipios(), entidad));
}

async function localidades(solicitud: HttpRequest<unknown>) {
  const { entidad = '', municipio = '' } = parametrosPlanos(solicitud);
  return responderOk(
    solicitud,
    localidadesDeEntidad(await cargarLocalidades(), entidad, municipio || null),
  );
}

/**
 * Simulated small catalogs shared by every module's filters and forms. Owned by the foundation.
 * The sucursales are the negocio handler's live list, so an alta, edición or baja shows in every
 * module's filters without a reload. Municipios and localidades load their JSON lazily.
 */
export const manejadorCatalogos: ManejadorApi = {
  responder(solicitud: HttpRequest<unknown>): RespuestaSimulada | null {
    if (solicitud.method !== 'GET') return null;
    switch (solicitud.url) {
      case RUTAS_CATALOGOS.divisas:
        return responderOk(solicitud, DIVISAS);
      case RUTAS_CATALOGOS.sucursales:
        return responderOk(solicitud, sucursalesActuales());
      case RUTAS_CATALOGOS.cajeros:
        return responderOk(solicitud, CAJEROS);
      case RUTAS_CATALOGOS.municipios:
        return municipios(solicitud);
      case RUTAS_CATALOGOS.localidades:
        return localidades(solicitud);
      default:
        return null;
    }
  },
};

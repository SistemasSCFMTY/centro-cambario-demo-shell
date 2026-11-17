import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RUTAS_CATALOGOS } from '@data/constants/catalogos.constants';
import { Cajero } from '@data/interfaces/cajero';
import { Divisa } from '@data/interfaces/divisa';
import { OpcionCatalogo } from '@data/interfaces/opcion-catalogo';
import { Sucursal } from '@data/interfaces/sucursal';
import { Observable } from 'rxjs';

/** backend-api small catalogs: what the filters and forms of every module list. */
@Injectable({ providedIn: 'root' })
export class CatalogosService {
  private readonly http = inject(HttpClient);

  divisas(): Observable<Divisa[]> {
    return this.http.get<Divisa[]>(RUTAS_CATALOGOS.divisas);
  }

  sucursales(): Observable<Sucursal[]> {
    return this.http.get<Sucursal[]>(RUTAS_CATALOGOS.sucursales);
  }

  cajeros(): Observable<Cajero[]> {
    return this.http.get<Cajero[]>(RUTAS_CATALOGOS.cajeros);
  }

  /** Municipios of an entidad (CNBV catalog); the key and the label are the name. */
  municipios(entidad: string): Observable<OpcionCatalogo[]> {
    return this.http.get<OpcionCatalogo[]>(RUTAS_CATALOGOS.municipios, { params: { entidad } });
  }

  /** Localidades of an entidad (CNBV catalog), narrowed to a municipio when one is given. */
  localidades(entidad: string, municipio: string): Observable<OpcionCatalogo[]> {
    const params: Record<string, string> = municipio ? { entidad, municipio } : { entidad };
    return this.http.get<OpcionCatalogo[]>(RUTAS_CATALOGOS.localidades, { params });
  }
}

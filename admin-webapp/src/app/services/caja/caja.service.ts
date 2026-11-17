import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RUTAS_CAJA } from '@data/constants/caja.constants';
import { CajasPaginaDto, ConteosPaginaDto } from '@data/dto/caja-pagina.dto';
import { ConsultaListaDto } from '@data/dto/lista.dto';
import { OpcionFiltro } from '@data/interfaces/opcion-filtro';
import { parametrosDeConsulta } from '@utils/lista/consulta-lista';
import { Observable } from 'rxjs';

/** backend-api caja. Thin HTTP. */
@Injectable({ providedIn: 'root' })
export class CajaService {
  private readonly http = inject(HttpClient);

  listar(consulta: ConsultaListaDto): Observable<CajasPaginaDto> {
    return this.http.get<CajasPaginaDto>(RUTAS_CAJA.lista, {
      params: parametrosDeConsulta(consulta),
    });
  }

  listarConteos(consulta: ConsultaListaDto): Observable<ConteosPaginaDto> {
    return this.http.get<ConteosPaginaDto>(RUTAS_CAJA.conteos, {
      params: parametrosDeConsulta(consulta),
    });
  }

  opciones(): Observable<OpcionFiltro[]> {
    return this.http.get<OpcionFiltro[]>(RUTAS_CAJA.opciones);
  }
}

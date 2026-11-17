import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RUTAS_OPERACIONES } from '@data/constants/operaciones.constants';
import { ConsultaListaDto, PaginaDto } from '@data/dto/lista.dto';
import { OperacionDetalleDto, OperacionListaDto } from '@data/dto/operaciones.dto';
import { parametrosDeConsulta } from '@utils/lista/consulta-lista';
import { Observable } from 'rxjs';

/** backend-api operaciones. Thin HTTP; the operaciones writer adds the module's other calls. */
@Injectable({ providedIn: 'root' })
export class OperacionesService {
  private readonly http = inject(HttpClient);

  listar(consulta: ConsultaListaDto): Observable<PaginaDto<OperacionListaDto>> {
    return this.http.get<PaginaDto<OperacionListaDto>>(RUTAS_OPERACIONES.lista, {
      params: parametrosDeConsulta(consulta),
    });
  }

  obtener(id: string): Observable<OperacionDetalleDto> {
    return this.http.get<OperacionDetalleDto>(`${RUTAS_OPERACIONES.detalle}${id}`);
  }
}

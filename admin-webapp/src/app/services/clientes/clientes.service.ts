import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RUTAS_CLIENTES } from '@data/constants/clientes.constants';
import { ClienteDetalleDto } from '@data/dto/clientes.dto';
import { ClienteOperacionesDto } from '@data/dto/clientes-operaciones.dto';
import { ConsultaListaDto, PaginaDto } from '@data/dto/lista.dto';
import { ClienteResumen } from '@data/interfaces/cliente-resumen';
import { parametrosDeConsulta } from '@utils/lista/consulta-lista';
import { Observable } from 'rxjs';

/** backend-api clientes. Thin HTTP. */
@Injectable({ providedIn: 'root' })
export class ClientesService {
  private readonly http = inject(HttpClient);

  listar(consulta: ConsultaListaDto): Observable<PaginaDto<ClienteResumen>> {
    return this.http.get<PaginaDto<ClienteResumen>>(RUTAS_CLIENTES.lista, {
      params: parametrosDeConsulta(consulta),
    });
  }

  obtener(id: string): Observable<ClienteDetalleDto> {
    return this.http.get<ClienteDetalleDto>(`${RUTAS_CLIENTES.detalle}${id}`);
  }

  operaciones(id: string): Observable<ClienteOperacionesDto> {
    return this.http.get<ClienteOperacionesDto>(
      `${RUTAS_CLIENTES.detalle}${id}${RUTAS_CLIENTES.sufijoOperaciones}`,
    );
  }
}

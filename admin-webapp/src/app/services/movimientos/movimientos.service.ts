import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RUTAS_MOVIMIENTOS } from '@data/constants/movimientos.constants';
import { ConsultaListaDto } from '@data/dto/lista.dto';
import {
  AprobacionDotacionDto,
  MovimientoDetalleDto,
  MovimientosPaginaDto,
  RechazoDotacionDto,
} from '@data/dto/movimientos.dto';
import { parametrosDeConsulta } from '@utils/lista/consulta-lista';
import { Observable } from 'rxjs';

/** backend-api movimientos. Thin HTTP. */
@Injectable({ providedIn: 'root' })
export class MovimientosService {
  private readonly http = inject(HttpClient);

  listar(consulta: ConsultaListaDto): Observable<MovimientosPaginaDto> {
    return this.http.get<MovimientosPaginaDto>(RUTAS_MOVIMIENTOS.lista, {
      params: parametrosDeConsulta(consulta),
    });
  }

  /** The filtered list, all pages, as a spreadsheet file. */
  exportar(consulta: ConsultaListaDto): Observable<Blob> {
    return this.http.get(RUTAS_MOVIMIENTOS.exportacion, {
      params: parametrosDeConsulta(consulta),
      responseType: 'blob',
    });
  }

  obtener(id: string): Observable<MovimientoDetalleDto> {
    return this.http.get<MovimientoDetalleDto>(`${RUTAS_MOVIMIENTOS.detalle}${id}`);
  }

  aprobarDotacion(id: string, aprobacion: AprobacionDotacionDto): Observable<MovimientoDetalleDto> {
    return this.http.post<MovimientoDetalleDto>(
      `${RUTAS_MOVIMIENTOS.detalle}${id}/${RUTAS_MOVIMIENTOS.aprobacion}`,
      aprobacion,
    );
  }

  rechazarDotacion(id: string, rechazo: RechazoDotacionDto): Observable<MovimientoDetalleDto> {
    return this.http.post<MovimientoDetalleDto>(
      `${RUTAS_MOVIMIENTOS.detalle}${id}/${RUTAS_MOVIMIENTOS.rechazo}`,
      rechazo,
    );
  }
}

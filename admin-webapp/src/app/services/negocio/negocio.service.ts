import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RUTAS_NEGOCIO, SUFIJO_ESTATUS_SUCURSAL } from '@data/constants/negocio.constants';
import { ConsultaListaDto, PaginaDto } from '@data/dto/lista.dto';
import { EstatusSucursalDto } from '@data/dto/negocio-estatus-sucursal.dto';
import { GuardarNegocioDto } from '@data/dto/negocio-guardar.dto';
import { PerfilNegocioDto } from '@data/dto/negocio-perfil.dto';
import { DatosSucursal } from '@data/interfaces/datos-sucursal-negocio';
import { OpcionesNegocio } from '@data/interfaces/opciones-negocio';
import { RegistroAuditoria } from '@data/interfaces/registro-auditoria';
import { SucursalResumen } from '@data/interfaces/sucursal-resumen-negocio';
import { parametrosDeConsulta } from '@utils/lista/consulta-lista';
import { Observable } from 'rxjs';

/** backend-api negocio. Thin HTTP: the centro's profile, its sucursales and their audit trail. */
@Injectable({ providedIn: 'root' })
export class NegocioService {
  private readonly http = inject(HttpClient);

  obtener(): Observable<PerfilNegocioDto> {
    return this.http.get<PerfilNegocioDto>(RUTAS_NEGOCIO.centro);
  }

  opciones(): Observable<OpcionesNegocio> {
    return this.http.get<OpcionesNegocio>(RUTAS_NEGOCIO.opciones);
  }

  auditoria(): Observable<RegistroAuditoria[]> {
    return this.http.get<RegistroAuditoria[]>(RUTAS_NEGOCIO.auditoria);
  }

  guardar(datos: GuardarNegocioDto): Observable<PerfilNegocioDto> {
    return this.http.put<PerfilNegocioDto>(RUTAS_NEGOCIO.centro, datos);
  }

  listarSucursales(consulta: ConsultaListaDto): Observable<PaginaDto<SucursalResumen>> {
    return this.http.get<PaginaDto<SucursalResumen>>(RUTAS_NEGOCIO.sucursales, {
      params: parametrosDeConsulta(consulta),
    });
  }

  obtenerSucursal(id: string): Observable<SucursalResumen> {
    return this.http.get<SucursalResumen>(`${RUTAS_NEGOCIO.sucursal}${id}`);
  }

  crearSucursal(datos: DatosSucursal): Observable<SucursalResumen> {
    return this.http.post<SucursalResumen>(RUTAS_NEGOCIO.sucursales, datos);
  }

  actualizarSucursal(id: string, datos: DatosSucursal): Observable<SucursalResumen> {
    return this.http.put<SucursalResumen>(`${RUTAS_NEGOCIO.sucursal}${id}`, datos);
  }

  cambiarEstatusSucursal(id: string, activa: boolean): Observable<SucursalResumen> {
    const cuerpo: EstatusSucursalDto = { activa };
    return this.http.put<SucursalResumen>(
      `${RUTAS_NEGOCIO.sucursal}${id}${SUFIJO_ESTATUS_SUCURSAL}`,
      cuerpo,
    );
  }
}

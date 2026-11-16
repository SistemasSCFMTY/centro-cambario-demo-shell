import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RUTAS_API } from '@data/constants/api.constants';
import { CredencialesDto, RetoOtpDto, SesionDto } from '@data/dto/autenticacion.dto';
import { Observable } from 'rxjs';

/** backend-api auth: login → OTP → session (plans/00, own users table + OTP, not Supabase Auth). */
@Injectable({ providedIn: 'root' })
export class AutenticacionService {
  private readonly http = inject(HttpClient);

  iniciarSesion(credenciales: CredencialesDto): Observable<RetoOtpDto> {
    return this.http.post<RetoOtpDto>(RUTAS_API.inicioSesion, credenciales);
  }

  verificarCodigo(idReto: string, codigo: string): Observable<SesionDto> {
    return this.http.post<SesionDto>(RUTAS_API.verificacion, { idReto, codigo });
  }

  reenviarCodigo(idReto: string): Observable<RetoOtpDto> {
    return this.http.post<RetoOtpDto>(RUTAS_API.reenvio, { idReto });
  }
}

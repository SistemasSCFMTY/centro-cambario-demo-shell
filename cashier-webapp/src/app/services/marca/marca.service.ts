import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RUTAS_API } from '@data/constants/api.constants';
import { MarcaDto } from '@data/dto/marca.dto';
import { Observable } from 'rxjs';

/** backend-api tenant branding. */
@Injectable({ providedIn: 'root' })
export class MarcaService {
  private readonly http = inject(HttpClient);

  obtener(): Observable<MarcaDto> {
    return this.http.get<MarcaDto>(RUTAS_API.marca);
  }
}

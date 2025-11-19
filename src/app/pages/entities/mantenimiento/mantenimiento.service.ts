import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../../shared';
import { Mantenimiento } from './mantenimiento.model';
import { ApiService } from '#app/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class MantenimientoService {
  private resourceUrl = `${ApiService.API_URL}/mantenimientos`;

  constructor(protected http: HttpClient) {}

  create(mantenimiento: Mantenimiento): Observable<HttpResponse<Mantenimiento>> {
    return this.http.post<Mantenimiento>(this.resourceUrl, mantenimiento, { observe: 'response' });
  }

  update(mantenimiento: Mantenimiento): Observable<HttpResponse<Mantenimiento>> {
    return this.http.put(`${this.resourceUrl}/${mantenimiento.id}`, mantenimiento, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Mantenimiento>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Mantenimiento[]>> {
    const options = createRequestOption(req);
    return this.http.get<Mantenimiento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../../shared';
import { Estacion } from './estacion.model';
import { ApiService } from '#app/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class EstacionService {
  private resourceUrl = `${ApiService.API_URL}/estacions`;

  constructor(protected http: HttpClient) {}

  create(estacion: Estacion): Observable<HttpResponse<Estacion>> {
    return this.http.post<Estacion>(this.resourceUrl, estacion, { observe: 'response' });
  }

  update(estacion: Estacion): Observable<HttpResponse<Estacion>> {
    return this.http.put(`${this.resourceUrl}/${estacion.id}`, estacion, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Estacion>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(): Observable<HttpResponse<Estacion[]>> {
    return this.http.get<Estacion[]>(`${this.resourceUrl}-no-page`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByMesaId(mesaId: number): Observable<HttpResponse<Estacion[]>> {
    return this.http.get<Estacion[]>(`${this.resourceUrl}-by-mesa/${mesaId}`, { observe: 'response' });
  }
}

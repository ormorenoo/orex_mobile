import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../../shared';
import { Polin } from './polin.model';
import { ApiService } from '#app/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class PolinService {
  private resourceUrl = `${ApiService.API_URL}/polins`;

  constructor(protected http: HttpClient) {}

  create(polin: Polin): Observable<HttpResponse<Polin>> {
    return this.http.post<Polin>(this.resourceUrl, polin, { observe: 'response' });
  }

  update(polin: Polin): Observable<HttpResponse<Polin>> {
    return this.http.put(`${this.resourceUrl}/${polin.id}`, polin, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Polin>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(): Observable<HttpResponse<Polin[]>> {
    return this.http.get<Polin[]>(`${this.resourceUrl}-no-page`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByEstacionId(idEstacion: number): Observable<HttpResponse<Polin[]>> {
    return this.http.get<Polin[]>(`${this.resourceUrl}-by-estacion-id/${idEstacion}`, { observe: 'response' });
  }
}

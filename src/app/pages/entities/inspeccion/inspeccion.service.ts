import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../../shared';
import { Inspeccion } from './inspeccion.model';
import { ApiService } from '#app/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class InspeccionService {
  private resourceUrl = `${ApiService.API_URL}/inspeccions`;

  constructor(protected http: HttpClient) {}

  create(inspeccion: Inspeccion): Observable<HttpResponse<Inspeccion>> {
    return this.http.post<Inspeccion>(this.resourceUrl, inspeccion, { observe: 'response' });
  }

  update(inspeccion: Inspeccion): Observable<HttpResponse<Inspeccion>> {
    return this.http.put(`${this.resourceUrl}/${inspeccion.id}`, inspeccion, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Inspeccion>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Inspeccion[]>> {
    const options = createRequestOption(req);
    return this.http.get<Inspeccion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  verImagen(id: number, tipo: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.resourceUrl}/${id}/imagen/${tipo}`, {
      responseType: 'blob',
      observe: 'response',
    });
  }
}

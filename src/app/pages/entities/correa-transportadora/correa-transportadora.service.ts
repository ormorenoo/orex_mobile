import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../../shared';
import { CorreaTransportadora } from './correa-transportadora.model';
import { ApiService } from '#app/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class CorreaTransportadoraService {
  private resourceUrl = `${ApiService.API_URL}/correa-transportadoras`;

  constructor(protected http: HttpClient) {}

  create(correaTransportadora: CorreaTransportadora): Observable<HttpResponse<CorreaTransportadora>> {
    return this.http.post<CorreaTransportadora>(this.resourceUrl, correaTransportadora, { observe: 'response' });
  }

  update(correaTransportadora: CorreaTransportadora): Observable<HttpResponse<CorreaTransportadora>> {
    return this.http.put(`${this.resourceUrl}/${correaTransportadora.id}`, correaTransportadora, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<CorreaTransportadora>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<CorreaTransportadora[]>> {
    const options = createRequestOption(req);
    return this.http.get<CorreaTransportadora[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByAreaIdAndFaenaId(areaId: number, faenaId: number): Observable<HttpResponse<CorreaTransportadora[]>> {
    return this.http.get<CorreaTransportadora[]>(`${this.resourceUrl}-by-area-and-faena/${areaId}/${faenaId}`, { observe: 'response' });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../../shared';
import { ClienteMandante } from './cliente-mandante.model';
import { ApiService } from '#app/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class ClienteMandanteService {
  private resourceUrl = `${ApiService.API_URL}/cliente-mandantes`;

  constructor(protected http: HttpClient) {}

  create(clienteMandante: ClienteMandante): Observable<HttpResponse<ClienteMandante>> {
    return this.http.post<ClienteMandante>(this.resourceUrl, clienteMandante, { observe: 'response' });
  }

  update(clienteMandante: ClienteMandante): Observable<HttpResponse<ClienteMandante>> {
    return this.http.put(`${this.resourceUrl}/${clienteMandante.id}`, clienteMandante, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<ClienteMandante>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<ClienteMandante[]>> {
    const options = createRequestOption(req);
    return this.http.get<ClienteMandante[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

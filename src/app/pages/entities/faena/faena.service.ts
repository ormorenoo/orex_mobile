import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../../shared';
import { Faena } from './faena.model';
import { ApiService } from '#app/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class FaenaService {
  private resourceUrl = `${ApiService.API_URL}/faenas`;

  constructor(protected http: HttpClient) {}

  create(faena: Faena): Observable<HttpResponse<Faena>> {
    return this.http.post<Faena>(this.resourceUrl, faena, { observe: 'response' });
  }

  update(faena: Faena): Observable<HttpResponse<Faena>> {
    return this.http.put(`${this.resourceUrl}/${faena.id}`, faena, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Faena>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Faena[]>> {
    const options = createRequestOption(req);
    return this.http.get<Faena[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

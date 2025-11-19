import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../../shared';
import { AreaFaena } from './area-faena.model';
import { ApiService } from '#app/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class AreaFaenaService {
  private resourceUrl = `${ApiService.API_URL}/area-faenas`;

  constructor(protected http: HttpClient) {}

  create(areaFaena: AreaFaena): Observable<HttpResponse<AreaFaena>> {
    return this.http.post<AreaFaena>(this.resourceUrl, areaFaena, { observe: 'response' });
  }

  update(areaFaena: AreaFaena): Observable<HttpResponse<AreaFaena>> {
    return this.http.put(`${this.resourceUrl}/${areaFaena.id}`, areaFaena, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<AreaFaena>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<AreaFaena[]>> {
    const options = createRequestOption(req);
    return this.http.get<AreaFaena[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

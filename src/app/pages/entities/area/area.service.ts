import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../../shared';
import { Area } from './area.model';
import { ApiService } from '#app/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class AreaService {
  private resourceUrl = `${ApiService.API_URL}/areas`;

  constructor(protected http: HttpClient) {}

  create(area: Area): Observable<HttpResponse<Area>> {
    return this.http.post<Area>(this.resourceUrl, area, { observe: 'response' });
  }

  update(area: Area): Observable<HttpResponse<Area>> {
    return this.http.put(`${this.resourceUrl}/${area.id}`, area, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Area>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Area[]>> {
    const options = createRequestOption(req);
    return this.http.get<Area[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByFaenaId(faenaId: number): Observable<HttpResponse<Area[]>> {
    return this.http.get<Area[]>(`${this.resourceUrl}-by-faena/${faenaId}`, { observe: 'response' });
  }
}

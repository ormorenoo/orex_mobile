import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../../shared';
import { MesaTrabajo } from './mesa-trabajo.model';
import { ApiService } from '#app/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class MesaTrabajoService {
  private resourceUrl = `${ApiService.API_URL}/mesa-trabajos`;

  constructor(protected http: HttpClient) {}

  create(mesaTrabajo: MesaTrabajo): Observable<HttpResponse<MesaTrabajo>> {
    return this.http.post<MesaTrabajo>(this.resourceUrl, mesaTrabajo, { observe: 'response' });
  }

  update(mesaTrabajo: MesaTrabajo): Observable<HttpResponse<MesaTrabajo>> {
    return this.http.put(`${this.resourceUrl}/${mesaTrabajo.id}`, mesaTrabajo, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<MesaTrabajo>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<MesaTrabajo[]>> {
    const options = createRequestOption(req);
    return this.http.get<MesaTrabajo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

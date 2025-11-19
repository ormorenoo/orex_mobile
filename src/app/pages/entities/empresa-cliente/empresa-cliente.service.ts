import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from '../../../shared';
import { EmpresaCliente } from './empresa-cliente.model';
import { ApiService } from '#app/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class EmpresaClienteService {
  private resourceUrl = `${ApiService.API_URL}/empresa-clientes`;

  constructor(protected http: HttpClient) {}

  create(empresaCliente: EmpresaCliente): Observable<HttpResponse<EmpresaCliente>> {
    return this.http.post<EmpresaCliente>(this.resourceUrl, empresaCliente, { observe: 'response' });
  }

  update(empresaCliente: EmpresaCliente): Observable<HttpResponse<EmpresaCliente>> {
    return this.http.put(`${this.resourceUrl}/${empresaCliente.id}`, empresaCliente, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<EmpresaCliente>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<EmpresaCliente[]>> {
    const options = createRequestOption(req);
    return this.http.get<EmpresaCliente[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}

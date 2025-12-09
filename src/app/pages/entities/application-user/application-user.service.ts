import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiService } from '#app/services/api/api.service';
import { ApplicationUser } from './application-user.model';

export type EntityResponseType = HttpResponse<ApplicationUser>;
export type EntityArrayResponseType = HttpResponse<ApplicationUser[]>;

@Injectable({ providedIn: 'root' })
export class ApplicationUserService {
  private resourceUrl = `${ApiService.API_URL}/application-users`;

  constructor(protected http: HttpClient) {}

  getCurrentUserProfile(): Observable<EntityResponseType> {
    return this.http.get<ApplicationUser>(`${this.resourceUrl}/me`, { observe: 'response' });
  }
}

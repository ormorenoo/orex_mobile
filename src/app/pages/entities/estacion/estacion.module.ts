import { Injectable, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { EstacionPage } from './estacion';
import { EstacionUpdatePage } from './estacion-update';
import { Estacion, EstacionDetailPage, EstacionService } from '.';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';

@Injectable({ providedIn: 'root' })
export class EstacionResolve implements Resolve<Estacion> {
  constructor(private service: EstacionService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Estacion> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Estacion>) => response.ok),
        map((estacion: HttpResponse<Estacion>) => estacion.body),
      );
    }
    return of(new Estacion());
  }
}

const routes: Routes = [
  {
    path: '',
    component: EstacionPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EstacionUpdatePage,
    resolve: {
      data: EstacionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EstacionDetailPage,
    resolve: {
      data: EstacionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EstacionUpdatePage,
    resolve: {
      data: EstacionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [EstacionPage, EstacionUpdatePage, EstacionDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class EstacionPageModule {}

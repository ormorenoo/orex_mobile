import { Injectable, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { AreaFaenaPage } from './area-faena';
import { AreaFaenaUpdatePage } from './area-faena-update';
import { AreaFaena, AreaFaenaDetailPage, AreaFaenaService } from '.';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';

@Injectable({ providedIn: 'root' })
export class AreaFaenaResolve implements Resolve<AreaFaena> {
  constructor(private service: AreaFaenaService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<AreaFaena> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<AreaFaena>) => response.ok),
        map((areaFaena: HttpResponse<AreaFaena>) => areaFaena.body),
      );
    }
    return of(new AreaFaena());
  }
}

const routes: Routes = [
  {
    path: '',
    component: AreaFaenaPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AreaFaenaUpdatePage,
    resolve: {
      data: AreaFaenaResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AreaFaenaDetailPage,
    resolve: {
      data: AreaFaenaResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AreaFaenaUpdatePage,
    resolve: {
      data: AreaFaenaResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [AreaFaenaPage, AreaFaenaUpdatePage, AreaFaenaDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class AreaFaenaPageModule {}

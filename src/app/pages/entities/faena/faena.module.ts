import { Injectable, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { FaenaPage } from './faena';
import { FaenaUpdatePage } from './faena-update';
import { Faena, FaenaDetailPage, FaenaService } from '.';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';

@Injectable({ providedIn: 'root' })
export class FaenaResolve implements Resolve<Faena> {
  constructor(private service: FaenaService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Faena> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Faena>) => response.ok),
        map((faena: HttpResponse<Faena>) => faena.body),
      );
    }
    return of(new Faena());
  }
}

const routes: Routes = [
  {
    path: '',
    component: FaenaPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FaenaUpdatePage,
    resolve: {
      data: FaenaResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FaenaDetailPage,
    resolve: {
      data: FaenaResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FaenaUpdatePage,
    resolve: {
      data: FaenaResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [FaenaPage, FaenaUpdatePage, FaenaDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class FaenaPageModule {}

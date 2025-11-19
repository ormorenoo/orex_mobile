import { Injectable, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { InspeccionPage } from './inspeccion';
import { InspeccionUpdatePage } from './inspeccion-update';
import { Inspeccion, InspeccionDetailPage, InspeccionService } from '.';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';

@Injectable({ providedIn: 'root' })
export class InspeccionResolve implements Resolve<Inspeccion> {
  constructor(private service: InspeccionService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Inspeccion> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Inspeccion>) => response.ok),
        map((inspeccion: HttpResponse<Inspeccion>) => inspeccion.body),
      );
    }
    return of(new Inspeccion());
  }
}

const routes: Routes = [
  {
    path: '',
    component: InspeccionPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InspeccionUpdatePage,
    resolve: {
      data: InspeccionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InspeccionDetailPage,
    resolve: {
      data: InspeccionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InspeccionUpdatePage,
    resolve: {
      data: InspeccionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [InspeccionPage, InspeccionUpdatePage, InspeccionDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class InspeccionPageModule {}

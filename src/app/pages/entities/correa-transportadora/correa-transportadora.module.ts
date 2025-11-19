import { Injectable, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { CorreaTransportadoraPage } from './correa-transportadora';
import { CorreaTransportadoraUpdatePage } from './correa-transportadora-update';
import { CorreaTransportadora, CorreaTransportadoraDetailPage, CorreaTransportadoraService } from '.';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';

@Injectable({ providedIn: 'root' })
export class CorreaTransportadoraResolve implements Resolve<CorreaTransportadora> {
  constructor(private service: CorreaTransportadoraService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<CorreaTransportadora> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<CorreaTransportadora>) => response.ok),
        map((correaTransportadora: HttpResponse<CorreaTransportadora>) => correaTransportadora.body),
      );
    }
    return of(new CorreaTransportadora());
  }
}

const routes: Routes = [
  {
    path: '',
    component: CorreaTransportadoraPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CorreaTransportadoraUpdatePage,
    resolve: {
      data: CorreaTransportadoraResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CorreaTransportadoraDetailPage,
    resolve: {
      data: CorreaTransportadoraResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CorreaTransportadoraUpdatePage,
    resolve: {
      data: CorreaTransportadoraResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [CorreaTransportadoraPage, CorreaTransportadoraUpdatePage, CorreaTransportadoraDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class CorreaTransportadoraPageModule {}

import { Injectable, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { MesaTrabajoPage } from './mesa-trabajo';
import { MesaTrabajoUpdatePage } from './mesa-trabajo-update';
import { MesaTrabajo, MesaTrabajoDetailPage, MesaTrabajoService } from '.';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';

@Injectable({ providedIn: 'root' })
export class MesaTrabajoResolve implements Resolve<MesaTrabajo> {
  constructor(private service: MesaTrabajoService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<MesaTrabajo> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<MesaTrabajo>) => response.ok),
        map((mesaTrabajo: HttpResponse<MesaTrabajo>) => mesaTrabajo.body),
      );
    }
    return of(new MesaTrabajo());
  }
}

const routes: Routes = [
  {
    path: '',
    component: MesaTrabajoPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MesaTrabajoUpdatePage,
    resolve: {
      data: MesaTrabajoResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MesaTrabajoDetailPage,
    resolve: {
      data: MesaTrabajoResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MesaTrabajoUpdatePage,
    resolve: {
      data: MesaTrabajoResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [MesaTrabajoPage, MesaTrabajoUpdatePage, MesaTrabajoDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class MesaTrabajoPageModule {}

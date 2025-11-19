import { Injectable, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { MantenimientoPage } from './mantenimiento';
import { MantenimientoUpdatePage } from './mantenimiento-update';
import { Mantenimiento, MantenimientoDetailPage, MantenimientoService } from '.';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';

@Injectable({ providedIn: 'root' })
export class MantenimientoResolve implements Resolve<Mantenimiento> {
  constructor(private service: MantenimientoService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Mantenimiento> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Mantenimiento>) => response.ok),
        map((mantenimiento: HttpResponse<Mantenimiento>) => mantenimiento.body),
      );
    }
    return of(new Mantenimiento());
  }
}

const routes: Routes = [
  {
    path: '',
    component: MantenimientoPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MantenimientoUpdatePage,
    resolve: {
      data: MantenimientoResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MantenimientoDetailPage,
    resolve: {
      data: MantenimientoResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MantenimientoUpdatePage,
    resolve: {
      data: MantenimientoResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [MantenimientoPage, MantenimientoUpdatePage, MantenimientoDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class MantenimientoPageModule {}

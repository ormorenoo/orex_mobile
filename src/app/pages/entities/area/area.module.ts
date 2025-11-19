import { Injectable, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { AreaPage } from './area';
import { AreaUpdatePage } from './area-update';
import { Area, AreaDetailPage, AreaService } from '.';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';

@Injectable({ providedIn: 'root' })
export class AreaResolve implements Resolve<Area> {
  constructor(private service: AreaService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Area> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Area>) => response.ok),
        map((area: HttpResponse<Area>) => area.body),
      );
    }
    return of(new Area());
  }
}

const routes: Routes = [
  {
    path: '',
    component: AreaPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AreaUpdatePage,
    resolve: {
      data: AreaResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AreaDetailPage,
    resolve: {
      data: AreaResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AreaUpdatePage,
    resolve: {
      data: AreaResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [AreaPage, AreaUpdatePage, AreaDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class AreaPageModule {}

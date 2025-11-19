import { Injectable, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { PolinPage } from './polin';
import { PolinUpdatePage } from './polin-update';
import { Polin, PolinDetailPage, PolinService } from '.';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';

@Injectable({ providedIn: 'root' })
export class PolinResolve implements Resolve<Polin> {
  constructor(private service: PolinService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Polin> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Polin>) => response.ok),
        map((polin: HttpResponse<Polin>) => polin.body),
      );
    }
    return of(new Polin());
  }
}

const routes: Routes = [
  {
    path: '',
    component: PolinPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PolinUpdatePage,
    resolve: {
      data: PolinResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PolinDetailPage,
    resolve: {
      data: PolinResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PolinUpdatePage,
    resolve: {
      data: PolinResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [PolinPage, PolinUpdatePage, PolinDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class PolinPageModule {}

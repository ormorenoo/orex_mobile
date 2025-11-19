import { Injectable, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { ClienteMandantePage } from './cliente-mandante';
import { ClienteMandanteUpdatePage } from './cliente-mandante-update';
import { ClienteMandante, ClienteMandanteDetailPage, ClienteMandanteService } from '.';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';

@Injectable({ providedIn: 'root' })
export class ClienteMandanteResolve implements Resolve<ClienteMandante> {
  constructor(private service: ClienteMandanteService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ClienteMandante> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ClienteMandante>) => response.ok),
        map((clienteMandante: HttpResponse<ClienteMandante>) => clienteMandante.body),
      );
    }
    return of(new ClienteMandante());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ClienteMandantePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClienteMandanteUpdatePage,
    resolve: {
      data: ClienteMandanteResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClienteMandanteDetailPage,
    resolve: {
      data: ClienteMandanteResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClienteMandanteUpdatePage,
    resolve: {
      data: ClienteMandanteResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ClienteMandantePage, ClienteMandanteUpdatePage, ClienteMandanteDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ClienteMandantePageModule {}

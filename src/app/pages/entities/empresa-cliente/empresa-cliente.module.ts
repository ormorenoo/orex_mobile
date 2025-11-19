import { Injectable, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { EmpresaClientePage } from './empresa-cliente';
import { EmpresaClienteUpdatePage } from './empresa-cliente-update';
import { EmpresaCliente, EmpresaClienteDetailPage, EmpresaClienteService } from '.';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';

@Injectable({ providedIn: 'root' })
export class EmpresaClienteResolve implements Resolve<EmpresaCliente> {
  constructor(private service: EmpresaClienteService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<EmpresaCliente> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<EmpresaCliente>) => response.ok),
        map((empresaCliente: HttpResponse<EmpresaCliente>) => empresaCliente.body),
      );
    }
    return of(new EmpresaCliente());
  }
}

const routes: Routes = [
  {
    path: '',
    component: EmpresaClientePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmpresaClienteUpdatePage,
    resolve: {
      data: EmpresaClienteResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmpresaClienteDetailPage,
    resolve: {
      data: EmpresaClienteResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmpresaClienteUpdatePage,
    resolve: {
      data: EmpresaClienteResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [EmpresaClientePage, EmpresaClienteUpdatePage, EmpresaClienteDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class EmpresaClientePageModule {}

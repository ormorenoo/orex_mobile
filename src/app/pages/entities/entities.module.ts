import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { EntitiesPage } from './entities.page';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';

const routes: Routes = [
  {
    path: '',
    component: EntitiesPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  { path: 'empresa-cliente', loadChildren: () => import('./empresa-cliente/empresa-cliente.module').then(m => m.EmpresaClientePageModule) },
  {
    path: 'cliente-mandante',
    loadChildren: () => import('./cliente-mandante/cliente-mandante.module').then(m => m.ClienteMandantePageModule),
  },
  { path: 'faena', loadChildren: () => import('./faena/faena.module').then(m => m.FaenaPageModule) },
  { path: 'area', loadChildren: () => import('./area/area.module').then(m => m.AreaPageModule) },
  { path: 'area-faena', loadChildren: () => import('./area-faena/area-faena.module').then(m => m.AreaFaenaPageModule) },
  {
    path: 'correa-transportadora',
    loadChildren: () => import('./correa-transportadora/correa-transportadora.module').then(m => m.CorreaTransportadoraPageModule),
  },
  { path: 'mesa-trabajo', loadChildren: () => import('./mesa-trabajo/mesa-trabajo.module').then(m => m.MesaTrabajoPageModule) },
  { path: 'estacion', loadChildren: () => import('./estacion/estacion.module').then(m => m.EstacionPageModule) },
  { path: 'polin', loadChildren: () => import('./polin/polin.module').then(m => m.PolinPageModule) },
  { path: 'inspeccion', loadChildren: () => import('./inspeccion/inspeccion.module').then(m => m.InspeccionPageModule) },
  { path: 'mantenimiento', loadChildren: () => import('./mantenimiento/mantenimiento.module').then(m => m.MantenimientoPageModule) },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, RouterModule.forChild(routes), TranslateModule],
  declarations: [EntitiesPage],
})
export class EntitiesPageModule {}

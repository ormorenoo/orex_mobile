import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { ScanPage } from './scan.page';
import { UserRouteAccessService } from '#app/services/auth/user-route-access.service';

const routes: Routes = [
  {
    path: '',
    component: ScanPage,
    data: { authorities: ['ROLE_USER'] },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [ScanPage],
})
export class ScanPageModule {}

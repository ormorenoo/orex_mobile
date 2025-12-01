import { Component } from '@angular/core';
import { IonItemSliding, NavController, Platform, ToastController } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Mantenimiento } from './mantenimiento.model';
import { MantenimientoService } from './mantenimiento.service';

@Component({
  selector: 'page-mantenimiento',
  templateUrl: 'mantenimiento.html',
  styleUrl: 'mantenimiento.scss',
})
export class MantenimientoPage {
  mantenimientos: Mantenimiento[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private mantenimientoService: MantenimientoService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.mantenimientos = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.mantenimientoService
      .query()
      .pipe(
        filter((res: HttpResponse<Mantenimiento[]>) => res.ok),
        map((res: HttpResponse<Mantenimiento[]>) => res.body),
      )
      .subscribe(
        (response: Mantenimiento[]) => {
          this.mantenimientos = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async error => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          await toast.present();
        },
      );
  }

  trackId(index: number, item: Mantenimiento) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/mantenimiento/new');
  }

  async edit(item: IonItemSliding, mantenimiento: Mantenimiento) {
    await this.navController.navigateForward(`/tabs/entities/mantenimiento/${mantenimiento.id}/edit`);
    await item.close();
  }

  async delete(mantenimiento) {
    this.mantenimientoService.delete(mantenimiento.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Mantenimiento deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(mantenimiento: Mantenimiento) {
    await this.navController.navigateForward(`/tabs/entities/mantenimiento/${mantenimiento.id}/view`);
  }
}

import { Component } from '@angular/core';
import { IonItemSliding, NavController, Platform, ToastController } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Estacion } from './estacion.model';
import { EstacionService } from './estacion.service';

@Component({
  selector: 'page-estacion',
  templateUrl: 'estacion.html',
})
export class EstacionPage {
  estacions: Estacion[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private estacionService: EstacionService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.estacions = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.estacionService
      .query()
      .pipe(
        filter((res: HttpResponse<Estacion[]>) => res.ok),
        map((res: HttpResponse<Estacion[]>) => res.body),
      )
      .subscribe(
        (response: Estacion[]) => {
          this.estacions = response;
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

  trackId(index: number, item: Estacion) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/estacion/new');
  }

  async edit(item: IonItemSliding, estacion: Estacion) {
    await this.navController.navigateForward(`/tabs/entities/estacion/${estacion.id}/edit`);
    await item.close();
  }

  async delete(estacion) {
    this.estacionService.delete(estacion.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Estacion deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(estacion: Estacion) {
    await this.navController.navigateForward(`/tabs/entities/estacion/${estacion.id}/view`);
  }
}

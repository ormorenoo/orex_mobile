import { Component } from '@angular/core';
import { IonItemSliding, NavController, Platform, ToastController } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { AreaFaena } from './area-faena.model';
import { AreaFaenaService } from './area-faena.service';

@Component({
  selector: 'page-area-faena',
  templateUrl: 'area-faena.html',
})
export class AreaFaenaPage {
  areaFaenas: AreaFaena[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private areaFaenaService: AreaFaenaService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.areaFaenas = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.areaFaenaService
      .query()
      .pipe(
        filter((res: HttpResponse<AreaFaena[]>) => res.ok),
        map((res: HttpResponse<AreaFaena[]>) => res.body),
      )
      .subscribe(
        (response: AreaFaena[]) => {
          this.areaFaenas = response;
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

  trackId(index: number, item: AreaFaena) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/area-faena/new');
  }

  async edit(item: IonItemSliding, areaFaena: AreaFaena) {
    await this.navController.navigateForward(`/tabs/entities/area-faena/${areaFaena.id}/edit`);
    await item.close();
  }

  async delete(areaFaena) {
    this.areaFaenaService.delete(areaFaena.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'AreaFaena deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(areaFaena: AreaFaena) {
    await this.navController.navigateForward(`/tabs/entities/area-faena/${areaFaena.id}/view`);
  }
}

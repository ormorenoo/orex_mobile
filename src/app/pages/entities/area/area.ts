import { Component } from '@angular/core';
import { IonItemSliding, NavController, Platform, ToastController } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Area } from './area.model';
import { AreaService } from './area.service';

@Component({
  selector: 'page-area',
  templateUrl: 'area.html',
})
export class AreaPage {
  areas: Area[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private areaService: AreaService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.areas = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.areaService
      .query()
      .pipe(
        filter((res: HttpResponse<Area[]>) => res.ok),
        map((res: HttpResponse<Area[]>) => res.body),
      )
      .subscribe(
        (response: Area[]) => {
          this.areas = response;
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

  trackId(index: number, item: Area) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/area/new');
  }

  async edit(item: IonItemSliding, area: Area) {
    await this.navController.navigateForward(`/tabs/entities/area/${area.id}/edit`);
    await item.close();
  }

  async delete(area) {
    this.areaService.delete(area.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Area deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(area: Area) {
    await this.navController.navigateForward(`/tabs/entities/area/${area.id}/view`);
  }
}

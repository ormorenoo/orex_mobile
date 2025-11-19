import { Component } from '@angular/core';
import { IonItemSliding, NavController, Platform, ToastController } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { CorreaTransportadora } from './correa-transportadora.model';
import { CorreaTransportadoraService } from './correa-transportadora.service';

@Component({
  selector: 'page-correa-transportadora',
  templateUrl: 'correa-transportadora.html',
})
export class CorreaTransportadoraPage {
  correaTransportadoras: CorreaTransportadora[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private correaTransportadoraService: CorreaTransportadoraService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.correaTransportadoras = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.correaTransportadoraService
      .query()
      .pipe(
        filter((res: HttpResponse<CorreaTransportadora[]>) => res.ok),
        map((res: HttpResponse<CorreaTransportadora[]>) => res.body),
      )
      .subscribe(
        (response: CorreaTransportadora[]) => {
          this.correaTransportadoras = response;
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

  trackId(index: number, item: CorreaTransportadora) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/correa-transportadora/new');
  }

  async edit(item: IonItemSliding, correaTransportadora: CorreaTransportadora) {
    await this.navController.navigateForward(`/tabs/entities/correa-transportadora/${correaTransportadora.id}/edit`);
    await item.close();
  }

  async delete(correaTransportadora) {
    this.correaTransportadoraService.delete(correaTransportadora.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'CorreaTransportadora deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(correaTransportadora: CorreaTransportadora) {
    await this.navController.navigateForward(`/tabs/entities/correa-transportadora/${correaTransportadora.id}/view`);
  }
}

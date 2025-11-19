import { Component } from '@angular/core';
import { IonItemSliding, NavController, Platform, ToastController } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Polin } from './polin.model';
import { PolinService } from './polin.service';

@Component({
  selector: 'page-polin',
  templateUrl: 'polin.html',
})
export class PolinPage {
  polins: Polin[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private polinService: PolinService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.polins = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.polinService
      .query()
      .pipe(
        filter((res: HttpResponse<Polin[]>) => res.ok),
        map((res: HttpResponse<Polin[]>) => res.body),
      )
      .subscribe(
        (response: Polin[]) => {
          this.polins = response;
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

  trackId(index: number, item: Polin) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/polin/new');
  }

  async edit(item: IonItemSliding, polin: Polin) {
    await this.navController.navigateForward(`/tabs/entities/polin/${polin.id}/edit`);
    await item.close();
  }

  async delete(polin) {
    this.polinService.delete(polin.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Polin deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(polin: Polin) {
    await this.navController.navigateForward(`/tabs/entities/polin/${polin.id}/view`);
  }
}

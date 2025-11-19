import { Component } from '@angular/core';
import { IonItemSliding, NavController, Platform, ToastController } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Faena } from './faena.model';
import { FaenaService } from './faena.service';

@Component({
  selector: 'page-faena',
  templateUrl: 'faena.html',
})
export class FaenaPage {
  faenas: Faena[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private faenaService: FaenaService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.faenas = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.faenaService
      .query()
      .pipe(
        filter((res: HttpResponse<Faena[]>) => res.ok),
        map((res: HttpResponse<Faena[]>) => res.body),
      )
      .subscribe(
        (response: Faena[]) => {
          this.faenas = response;
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

  trackId(index: number, item: Faena) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/faena/new');
  }

  async edit(item: IonItemSliding, faena: Faena) {
    await this.navController.navigateForward(`/tabs/entities/faena/${faena.id}/edit`);
    await item.close();
  }

  async delete(faena) {
    this.faenaService.delete(faena.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Faena deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(faena: Faena) {
    await this.navController.navigateForward(`/tabs/entities/faena/${faena.id}/view`);
  }
}

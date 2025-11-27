import { Component } from '@angular/core';
import { IonItemSliding, NavController, Platform, ToastController } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Inspeccion } from './inspeccion.model';
import { InspeccionService } from './inspeccion.service';

@Component({
  selector: 'page-inspeccion',
  templateUrl: 'inspeccion.html',
  styleUrls: ['inspeccion.scss'],
})
export class InspeccionPage {
  inspeccions: Inspeccion[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private inspeccionService: InspeccionService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.inspeccions = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.inspeccionService
      .query()
      .pipe(
        filter((res: HttpResponse<Inspeccion[]>) => res.ok),
        map((res: HttpResponse<Inspeccion[]>) => res.body),
      )
      .subscribe(
        (response: Inspeccion[]) => {
          this.inspeccions = response;
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

  trackId(index: number, item: Inspeccion) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/inspeccion/new');
  }

  async edit(inspeccion: Inspeccion) {
    await this.navController.navigateForward(`/tabs/entities/inspeccion/${inspeccion.id}/edit`);
  }

  async delete(inspeccion) {
    this.inspeccionService.delete(inspeccion.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Inspeccion deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(inspeccion: Inspeccion) {
    await this.navController.navigateForward(`/tabs/entities/inspeccion/${inspeccion.id}/view`);
  }
}

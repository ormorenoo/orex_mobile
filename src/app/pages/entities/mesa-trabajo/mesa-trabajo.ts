import { Component } from '@angular/core';
import { IonItemSliding, NavController, Platform, ToastController } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { MesaTrabajo } from './mesa-trabajo.model';
import { MesaTrabajoService } from './mesa-trabajo.service';

@Component({
  selector: 'page-mesa-trabajo',
  templateUrl: 'mesa-trabajo.html',
})
export class MesaTrabajoPage {
  mesaTrabajos: MesaTrabajo[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private mesaTrabajoService: MesaTrabajoService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.mesaTrabajos = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.mesaTrabajoService
      .query()
      .pipe(
        filter((res: HttpResponse<MesaTrabajo[]>) => res.ok),
        map((res: HttpResponse<MesaTrabajo[]>) => res.body),
      )
      .subscribe(
        (response: MesaTrabajo[]) => {
          this.mesaTrabajos = response;
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

  trackId(index: number, item: MesaTrabajo) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/mesa-trabajo/new');
  }

  async edit(item: IonItemSliding, mesaTrabajo: MesaTrabajo) {
    await this.navController.navigateForward(`/tabs/entities/mesa-trabajo/${mesaTrabajo.id}/edit`);
    await item.close();
  }

  async delete(mesaTrabajo) {
    this.mesaTrabajoService.delete(mesaTrabajo.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'MesaTrabajo deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(mesaTrabajo: MesaTrabajo) {
    await this.navController.navigateForward(`/tabs/entities/mesa-trabajo/${mesaTrabajo.id}/view`);
  }
}

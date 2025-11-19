import { Component } from '@angular/core';
import { IonItemSliding, NavController, Platform, ToastController } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ClienteMandante } from './cliente-mandante.model';
import { ClienteMandanteService } from './cliente-mandante.service';

@Component({
  selector: 'page-cliente-mandante',
  templateUrl: 'cliente-mandante.html',
})
export class ClienteMandantePage {
  clienteMandantes: ClienteMandante[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private clienteMandanteService: ClienteMandanteService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.clienteMandantes = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.clienteMandanteService
      .query()
      .pipe(
        filter((res: HttpResponse<ClienteMandante[]>) => res.ok),
        map((res: HttpResponse<ClienteMandante[]>) => res.body),
      )
      .subscribe(
        (response: ClienteMandante[]) => {
          this.clienteMandantes = response;
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

  trackId(index: number, item: ClienteMandante) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/cliente-mandante/new');
  }

  async edit(item: IonItemSliding, clienteMandante: ClienteMandante) {
    await this.navController.navigateForward(`/tabs/entities/cliente-mandante/${clienteMandante.id}/edit`);
    await item.close();
  }

  async delete(clienteMandante) {
    this.clienteMandanteService.delete(clienteMandante.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ClienteMandante deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(clienteMandante: ClienteMandante) {
    await this.navController.navigateForward(`/tabs/entities/cliente-mandante/${clienteMandante.id}/view`);
  }
}

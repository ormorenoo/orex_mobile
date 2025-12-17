import { Component } from '@angular/core';
import { IonItemSliding, NavController, Platform, ToastController } from '@ionic/angular';
import { filter, map, take } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Inspeccion } from './inspeccion.model';
import { InspeccionService } from './inspeccion.service';
import { NetworkService } from '#app/services/utils/network.service';
import { EntitiesOfflineService } from '#app/services/utils/entities-offline';

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
    private networkService: NetworkService,
    private entitiesOfflineService: EntitiesOfflineService,
    public plt: Platform,
  ) {
    this.inspeccions = [];
  }

  async ionViewWillEnter() {
    await this.loadData();
  }

  async loadData(refresher?: any) {
    try {
      const online = await this.networkService.isOnline();

      if (online) {
        await this.loadOnline();
      } else {
        await this.loadOffline();
      }
    } catch (error) {
      console.error(error);
      const toast = await this.toastCtrl.create({
        message: 'Failed to load data',
        duration: 2000,
        position: 'middle',
      });
      await toast.present();
    } finally {
      if (refresher) {
        setTimeout(() => refresher.target.complete(), 750);
      }
    }
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
        await this.loadData();
      },
      error => console.error(error),
    );
  }

  async view(inspeccion: Inspeccion) {
    await this.navController.navigateForward(`/tabs/entities/inspeccion/${inspeccion.id}/view`);
  }

  private async loadOffline(): Promise<void> {
    const [locales, remotos] = await Promise.all([
      this.entitiesOfflineService.getInspeccionesLocal(),
      this.entitiesOfflineService.getInspecciones(),
    ]);

    this.inspeccions = this.mergeInspecciones(remotos ?? [], locales ?? []);
  }

  private mergeInspecciones(remotos: Inspeccion[], locales: Inspeccion[]): Inspeccion[] {
    const map = new Map<number | string, Inspeccion>();

    // Primero los remotos (fuente oficial)
    remotos.forEach(m => {
      if (m.id != null) {
        map.set(m.id, m);
      }
    });

    // Luego los locales (solo si no existe remoto)
    locales.forEach(m => {
      const key = m.id ?? crypto.randomUUID();
      if (!map.has(key)) {
        map.set(key, m);
      }
    });

    return Array.from(map.values());
  }

  private async loadOnline(): Promise<void> {
    const response = await this.inspeccionService
      .query()
      .pipe(
        filter((res: HttpResponse<Inspeccion[]>) => res.ok),
        map((res: HttpResponse<Inspeccion[]>) => res.body ?? []),
        take(1),
      )
      .toPromise();

    this.inspeccions = response;
  }
}

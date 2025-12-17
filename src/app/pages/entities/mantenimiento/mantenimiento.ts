import { Component } from '@angular/core';
import { IonItemSliding, NavController, Platform, ToastController } from '@ionic/angular';
import { filter, map, take } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Mantenimiento } from './mantenimiento.model';
import { MantenimientoService } from './mantenimiento.service';
import { MantenimientoOfflineService } from './mantenimiento-offline-service';
import { EntitiesOfflineService } from '#app/services/utils/entities-offline';
import { NetworkService } from '#app/services/utils/network.service';

@Component({
  selector: 'page-mantenimiento',
  templateUrl: 'mantenimiento.html',
  styleUrl: 'mantenimiento.scss',
})
export class MantenimientoPage {
  mantenimientos: Mantenimiento[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private mantenimientoService: MantenimientoService,
    private toastCtrl: ToastController,
    public plt: Platform,
    private networkService: NetworkService,
    private entitiesOfflineService: EntitiesOfflineService,
    private mantenimientoOfflineService: MantenimientoOfflineService,
  ) {
    this.mantenimientos = [];
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

  trackId(index: number, item: Mantenimiento) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/mantenimiento/new');
  }

  async edit(item: IonItemSliding, mantenimiento: Mantenimiento) {
    await this.navController.navigateForward(`/tabs/entities/mantenimiento/${mantenimiento.id}/edit`);
    await item.close();
  }

  async delete(mantenimiento) {
    this.mantenimientoService.delete(mantenimiento.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Mantenimiento deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadData();
      },
      error => console.error(error),
    );
  }

  async view(mantenimiento: Mantenimiento) {
    await this.navController.navigateForward(`/tabs/entities/mantenimiento/${mantenimiento.id}/view`);
  }

  private async loadOffline(): Promise<void> {
    const [locales, remotos] = await Promise.all([
      this.entitiesOfflineService.getMantenimientosLocal(),
      this.entitiesOfflineService.getMantenimientos(),
    ]);

    this.mantenimientos = this.mergeMantenimientos(remotos ?? [], locales ?? []);
  }

  private mergeMantenimientos(remotos: Mantenimiento[], locales: Mantenimiento[]): Mantenimiento[] {
    const map = new Map<number | string, Mantenimiento>();

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
    const response = await this.mantenimientoService
      .query()
      .pipe(
        filter((res: HttpResponse<Mantenimiento[]>) => res.ok),
        map((res: HttpResponse<Mantenimiento[]>) => res.body ?? []),
        take(1),
      )
      .toPromise();

    this.mantenimientos = response;
  }
}

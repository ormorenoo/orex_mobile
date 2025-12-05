import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Mantenimiento } from './mantenimiento.model';
import { MantenimientoService } from './mantenimiento.service';
import { Inspeccion } from '../inspeccion';
import { NetworkService } from '#app/services/utils/network.service';
import { MantenimientoOfflineService } from './mantenimiento-offline-service';

@Component({
  selector: 'page-mantenimiento-detail',
  templateUrl: 'mantenimiento-detail.html',
  styleUrl: 'mantenimiento-detail.scss',
})
export class MantenimientoDetailPage implements OnInit {
  mantenimiento: Mantenimiento = {};
  thumbnailGeneral: string | null = null;
  thumbnailDetallePolin: string | null = null;
  imagenSeleccionada: string | null = null;
  @ViewChild('modalImagen', { read: IonModal }) modalImagen: IonModal;

  constructor(
    private navController: NavController,
    private mantenimientoService: MantenimientoService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private networkService: NetworkService,
    private mantenimientoOfflineService: MantenimientoOfflineService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.mantenimiento = response.data;
      if (this.mantenimiento.id) {
        this.loadThumbnails(this.mantenimiento.id);
      }
    });
  }

  loadThumbnails(id: number) {
    this.loadImage(id, 'general', 'thumbnailGeneral');
    this.loadImage(id, 'detallePolin', 'thumbnailDetallePolin');
  }

  loadImage(id: number, tipo: string, destino: 'thumbnailGeneral' | 'thumbnailDetallePolin') {
    this.mantenimientoService.verImagen(id, tipo).subscribe(response => {
      const contentType = response.headers.get('Content-Type') ?? 'image/jpeg';
      const blob = new Blob([response.body], { type: contentType });
      const url = URL.createObjectURL(blob);
      this[destino] = url;
    });
  }

  openImage(url: string) {
    this.imagenSeleccionada = url;
    this.modalImagen.present();
  }

  closeModal() {
    this.modalImagen.dismiss();
  }

  openInspeccion(item: Inspeccion) {
    this.navController.navigateForward(`/tabs/entities/inspeccion/${item.id}/view`);
  }

  async deleteModal(item: Mantenimiento) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: async () => {
            const online = await this.networkService.isOnline();
            if (online) {
              this.mantenimientoService.delete(item.id).subscribe(() => {
                this.navController.navigateForward('/tabs/entities/mantenimiento');
              });
            } else {
              await this.mantenimientoOfflineService.deleteOffline(item.id);
            }
          },
        },
      ],
    });
    await alert.present();
  }
}

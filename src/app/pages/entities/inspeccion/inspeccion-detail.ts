import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Inspeccion } from './inspeccion.model';
import { InspeccionService } from './inspeccion.service';
import { InspeccionOfflineSaveService } from './inspeccion-offline-save-service';
import { NetworkService } from '#app/services/utils/network.service';

@Component({
  selector: 'page-inspeccion-detail',
  templateUrl: 'inspeccion-detail.html',
  styleUrl: 'inspeccion-detail.scss',
})
export class InspeccionDetailPage implements OnInit {
  inspeccion: Inspeccion = {};
  thumbnailGeneral: string | null = null;
  thumbnailDetallePolin: string | null = null;
  imagenSeleccionada: string | null = null;
  @ViewChild('modalImagen', { read: IonModal }) modalImagen: IonModal;

  constructor(
    private navController: NavController,
    private inspeccionService: InspeccionService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private networkService: NetworkService,
    private inspeccionOffline: InspeccionOfflineSaveService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.inspeccion = response.data;
      if (this.inspeccion.id) {
        this.loadThumbnails(this.inspeccion.id);
      }
    });
  }

  loadThumbnails(id: number) {
    this.loadImage(id, 'general', 'thumbnailGeneral');
    this.loadImage(id, 'detallePolin', 'thumbnailDetallePolin');
  }

  loadImage(id: number, tipo: string, destino: 'thumbnailGeneral' | 'thumbnailDetallePolin') {
    this.inspeccionService.verImagen(id, tipo).subscribe(response => {
      const contentType = response.headers.get('Content-Type') ?? 'image/jpeg';
      const blob = new Blob([response.body], { type: contentType });
      const url = URL.createObjectURL(blob);
      this[destino] = url;
    });
  }

  open(item: Inspeccion) {
    this.navController.navigateForward(`/tabs/entities/inspeccion/${item.id}/edit`);
  }

  openImage(url: string) {
    this.imagenSeleccionada = url;
    this.modalImagen.present();
  }

  closeModal() {
    this.modalImagen.dismiss();
  }

  openPolin(id: number) {
    this.navController.navigateForward(`/tabs/entities/polin/${id}/view`);
  }

  async deleteModal(item: Inspeccion) {
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
              this.inspeccionService.delete(item.id).subscribe(() => {
                this.navController.navigateForward('/tabs/entities/inspeccion');
              });
            } else {
              await this.inspeccionOffline.deleteOffline(item.idLocal);
            }
          },
        },
      ],
    });
    await alert.present();
  }
}

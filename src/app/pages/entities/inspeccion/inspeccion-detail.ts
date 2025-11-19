import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Inspeccion } from './inspeccion.model';
import { InspeccionService } from './inspeccion.service';

@Component({
  selector: 'page-inspeccion-detail',
  templateUrl: 'inspeccion-detail.html',
})
export class InspeccionDetailPage implements OnInit {
  inspeccion: Inspeccion = {};

  constructor(
    private navController: NavController,
    private inspeccionService: InspeccionService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.inspeccion = response.data;
    });
  }

  open(item: Inspeccion) {
    this.navController.navigateForward(`/tabs/entities/inspeccion/${item.id}/edit`);
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
          handler: () => {
            this.inspeccionService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/inspeccion');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}

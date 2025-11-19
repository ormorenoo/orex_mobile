import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Estacion } from './estacion.model';
import { EstacionService } from './estacion.service';

@Component({
  selector: 'page-estacion-detail',
  templateUrl: 'estacion-detail.html',
})
export class EstacionDetailPage implements OnInit {
  estacion: Estacion = {};

  constructor(
    private navController: NavController,
    private estacionService: EstacionService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.estacion = response.data;
    });
  }

  open(item: Estacion) {
    this.navController.navigateForward(`/tabs/entities/estacion/${item.id}/edit`);
  }

  async deleteModal(item: Estacion) {
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
            this.estacionService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/estacion');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}

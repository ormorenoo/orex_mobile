import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CorreaTransportadora } from './correa-transportadora.model';
import { CorreaTransportadoraService } from './correa-transportadora.service';

@Component({
  selector: 'page-correa-transportadora-detail',
  templateUrl: 'correa-transportadora-detail.html',
  styleUrl: 'correa-transportadora-detail.scss',
})
export class CorreaTransportadoraDetailPage implements OnInit {
  correaTransportadora: CorreaTransportadora = {};

  constructor(
    private navController: NavController,
    private correaTransportadoraService: CorreaTransportadoraService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.correaTransportadora = response.data;
    });
  }

  open(item: CorreaTransportadora) {
    this.navController.navigateForward(`/tabs/entities/correa-transportadora/${item.id}/edit`);
  }

  async deleteModal(item: CorreaTransportadora) {
    const alert = await this.alertController.create({
      header: '¿Eliminar este registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.correaTransportadoraService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/correa-transportadora');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}

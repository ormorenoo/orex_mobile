import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ClienteMandante } from './cliente-mandante.model';
import { ClienteMandanteService } from './cliente-mandante.service';

@Component({
  selector: 'page-cliente-mandante-detail',
  templateUrl: 'cliente-mandante-detail.html',
})
export class ClienteMandanteDetailPage implements OnInit {
  clienteMandante: ClienteMandante = {};

  constructor(
    private navController: NavController,
    private clienteMandanteService: ClienteMandanteService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.clienteMandante = response.data;
    });
  }

  open(item: ClienteMandante) {
    this.navController.navigateForward(`/tabs/entities/cliente-mandante/${item.id}/edit`);
  }

  async deleteModal(item: ClienteMandante) {
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
            this.clienteMandanteService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/cliente-mandante');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}

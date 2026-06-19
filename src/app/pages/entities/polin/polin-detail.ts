import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Polin } from './polin.model';
import { PolinService } from './polin.service';
import { estadoClase, estadoLabel, posicionLabel, tipoPolinLabel } from '#app/shared/utils/polin-ui.utils';

@Component({
  selector: 'page-polin-detail',
  templateUrl: 'polin-detail.html',
  styleUrls: ['polin-detail.scss'],
})
export class PolinDetailPage implements OnInit {
  polin: Polin = {};
  estadoClase = estadoClase;
  estadoLabel = estadoLabel;
  posicionLabel = posicionLabel;
  tipoPolinLabel = tipoPolinLabel;

  constructor(
    private navController: NavController,
    private polinService: PolinService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.polin = response.data;
    });
  }

  open(item: Polin) {
    this.navController.navigateForward(`/tabs/entities/polin/${item.id}/edit`);
  }

  async deleteModal(item: Polin) {
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
            this.polinService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/polin');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}

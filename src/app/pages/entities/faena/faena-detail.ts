import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Faena } from './faena.model';
import { FaenaService } from './faena.service';

@Component({
  selector: 'page-faena-detail',
  templateUrl: 'faena-detail.html',
  styleUrls: ['faena-detail.scss'],
})
export class FaenaDetailPage implements OnInit {
  faena: Faena = {};

  constructor(
    private navController: NavController,
    private faenaService: FaenaService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.faena = response.data;
    });
  }

  open(item: Faena) {
    this.navController.navigateForward(`/tabs/entities/faena/${item.id}/edit`);
  }

  async deleteModal(item: Faena) {
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
            this.faenaService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/faena');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}

import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AreaFaena } from './area-faena.model';
import { AreaFaenaService } from './area-faena.service';

@Component({
  selector: 'page-area-faena-detail',
  templateUrl: 'area-faena-detail.html',
})
export class AreaFaenaDetailPage implements OnInit {
  areaFaena: AreaFaena = {};

  constructor(
    private navController: NavController,
    private areaFaenaService: AreaFaenaService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.areaFaena = response.data;
    });
  }

  open(item: AreaFaena) {
    this.navController.navigateForward(`/tabs/entities/area-faena/${item.id}/edit`);
  }

  async deleteModal(item: AreaFaena) {
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
            this.areaFaenaService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/area-faena');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}

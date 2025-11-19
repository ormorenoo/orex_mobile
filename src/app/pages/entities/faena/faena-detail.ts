import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Faena } from './faena.model';
import { FaenaService } from './faena.service';

@Component({
  selector: 'page-faena-detail',
  templateUrl: 'faena-detail.html',
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

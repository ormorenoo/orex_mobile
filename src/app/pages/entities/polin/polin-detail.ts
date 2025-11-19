import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Polin } from './polin.model';
import { PolinService } from './polin.service';

@Component({
  selector: 'page-polin-detail',
  templateUrl: 'polin-detail.html',
})
export class PolinDetailPage implements OnInit {
  polin: Polin = {};

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

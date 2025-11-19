import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { MesaTrabajo } from './mesa-trabajo.model';
import { MesaTrabajoService } from './mesa-trabajo.service';

@Component({
  selector: 'page-mesa-trabajo-detail',
  templateUrl: 'mesa-trabajo-detail.html',
})
export class MesaTrabajoDetailPage implements OnInit {
  mesaTrabajo: MesaTrabajo = {};

  constructor(
    private navController: NavController,
    private mesaTrabajoService: MesaTrabajoService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.mesaTrabajo = response.data;
    });
  }

  open(item: MesaTrabajo) {
    this.navController.navigateForward(`/tabs/entities/mesa-trabajo/${item.id}/edit`);
  }

  async deleteModal(item: MesaTrabajo) {
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
            this.mesaTrabajoService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/mesa-trabajo');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}

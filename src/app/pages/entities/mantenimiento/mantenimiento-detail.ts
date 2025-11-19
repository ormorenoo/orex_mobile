import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Mantenimiento } from './mantenimiento.model';
import { MantenimientoService } from './mantenimiento.service';

@Component({
  selector: 'page-mantenimiento-detail',
  templateUrl: 'mantenimiento-detail.html',
})
export class MantenimientoDetailPage implements OnInit {
  mantenimiento: Mantenimiento = {};

  constructor(
    private navController: NavController,
    private mantenimientoService: MantenimientoService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.mantenimiento = response.data;
    });
  }

  open(item: Mantenimiento) {
    this.navController.navigateForward(`/tabs/entities/mantenimiento/${item.id}/edit`);
  }

  async deleteModal(item: Mantenimiento) {
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
            this.mantenimientoService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/mantenimiento');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}

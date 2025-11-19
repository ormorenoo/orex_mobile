import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Area } from './area.model';
import { AreaService } from './area.service';

@Component({
  selector: 'page-area-detail',
  templateUrl: 'area-detail.html',
})
export class AreaDetailPage implements OnInit {
  area: Area = {};

  constructor(
    private navController: NavController,
    private areaService: AreaService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.area = response.data;
    });
  }

  open(item: Area) {
    this.navController.navigateForward(`/tabs/entities/area/${item.id}/edit`);
  }

  async deleteModal(item: Area) {
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
            this.areaService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/area');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}

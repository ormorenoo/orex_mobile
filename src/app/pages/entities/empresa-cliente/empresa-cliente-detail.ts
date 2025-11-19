import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { EmpresaCliente } from './empresa-cliente.model';
import { EmpresaClienteService } from './empresa-cliente.service';

@Component({
  selector: 'page-empresa-cliente-detail',
  templateUrl: 'empresa-cliente-detail.html',
})
export class EmpresaClienteDetailPage implements OnInit {
  empresaCliente: EmpresaCliente = {};

  constructor(
    private navController: NavController,
    private empresaClienteService: EmpresaClienteService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.empresaCliente = response.data;
    });
  }

  open(item: EmpresaCliente) {
    this.navController.navigateForward(`/tabs/entities/empresa-cliente/${item.id}/edit`);
  }

  async deleteModal(item: EmpresaCliente) {
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
            this.empresaClienteService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/empresa-cliente');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}

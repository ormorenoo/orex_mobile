import { Component } from '@angular/core';
import { IonItemSliding, NavController, Platform, ToastController } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { EmpresaCliente } from './empresa-cliente.model';
import { EmpresaClienteService } from './empresa-cliente.service';

@Component({
  selector: 'page-empresa-cliente',
  templateUrl: 'empresa-cliente.html',
})
export class EmpresaClientePage {
  empresaClientes: EmpresaCliente[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private empresaClienteService: EmpresaClienteService,
    private toastCtrl: ToastController,
    public plt: Platform,
  ) {
    this.empresaClientes = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.empresaClienteService
      .query()
      .pipe(
        filter((res: HttpResponse<EmpresaCliente[]>) => res.ok),
        map((res: HttpResponse<EmpresaCliente[]>) => res.body),
      )
      .subscribe(
        (response: EmpresaCliente[]) => {
          this.empresaClientes = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async error => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          await toast.present();
        },
      );
  }

  trackId(index: number, item: EmpresaCliente) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/empresa-cliente/new');
  }

  async edit(item: IonItemSliding, empresaCliente: EmpresaCliente) {
    await this.navController.navigateForward(`/tabs/entities/empresa-cliente/${empresaCliente.id}/edit`);
    await item.close();
  }

  async delete(empresaCliente) {
    this.empresaClienteService.delete(empresaCliente.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'EmpresaCliente deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error),
    );
  }

  async view(empresaCliente: EmpresaCliente) {
    await this.navController.navigateForward(`/tabs/entities/empresa-cliente/${empresaCliente.id}/view`);
  }
}

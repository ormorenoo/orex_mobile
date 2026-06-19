import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss'],
})
export class ScanPage {
  constructor(
    private navController: NavController,
    private alertController: AlertController,
  ) {}

  volver(): void {
    this.navController.navigateBack('/tabs/home');
  }

  /**
   * Escaneo real: pendiente de plugin de cámara/escáner (Capacitor) o del deep link
   * del QR (REQ-324-001). Entretanto, permite abrir la mesa por código manual.
   */
  async ingresarCodigo(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Ingresar código de mesa',
      inputs: [{ name: 'id', type: 'number', placeholder: 'ID de la mesa' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Abrir',
          handler: data => {
            if (data.id) {
              this.navController.navigateForward(`/tabs/entities/mesa-trabajo/${data.id}/view`);
            }
          },
        },
      ],
    });
    await alert.present();
  }
}

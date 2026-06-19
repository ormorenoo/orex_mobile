import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { Account } from 'src/model/account.model';
import { AccountService } from '#app/services/auth/account.service';
import { LoginService } from '#app/services/login/login.service';
import { NetworkService } from '#app/services/utils/network.service';
import { OfflineSyncService } from '#app/services/offline/offline-sync.service';
import { MesaTrabajo } from '../entities/mesa-trabajo';
import { MesaTrabajoService } from '../entities/mesa-trabajo/mesa-trabajo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  account: Account;
  isLoading = false;
  online = true;
  mesasRecientes: MesaTrabajo[] = [];

  constructor(
    public navController: NavController,
    private accountService: AccountService,
    private loginService: LoginService,
    private networkService: NetworkService,
    private offlineSyncService: OfflineSyncService,
    private mesaTrabajoService: MesaTrabajoService,
    private alertController: AlertController,
  ) {}

  async ngOnInit() {
    this.online = await this.networkService.isOnline();

    if (this.online) {
      this.account = await this.accountService.identity();
      void this.cargarMesasRecientes();
    } else {
      this.account = null;
    }
  }

  private async cargarMesasRecientes(): Promise<void> {
    try {
      const resp = await firstValueFrom(this.mesaTrabajoService.query());
      this.mesasRecientes = (resp.body ?? []).slice(0, 5);
    } catch {
      this.mesasRecientes = [];
    }
  }

  subtituloMesa(mesa: MesaTrabajo): string {
    const correa = mesa.correaTransportadora?.tagId;
    const area = mesa.correaTransportadora?.areaFaena?.area?.nombre;
    return [correa, area].filter(Boolean).join(' · ');
  }

  goScan(): void {
    this.navController.navigateForward('/scan');
  }

  /** Abre una mesa por su código (ID) sin escanear el QR. */
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

  abrirMesa(mesa: MesaTrabajo): void {
    this.navController.navigateForward(`/tabs/entities/mesa-trabajo/${mesa.id}/view`);
  }

  async sync() {
    this.isLoading = true;
    await this.offlineSyncService.syncAll();
    this.isLoading = false;
    alert('Sincronización completada');
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  logout() {
    this.loginService.logout();
    this.goBackToHomePage();
  }

  goTo(section: string) {
    this.navController.navigateForward(`/tabs/entities/${section}`);
  }

  create(type: string) {
    if (type === 'inspeccion') {
      this.navController.navigateForward('/tabs/entities/inspeccion/new');
    }

    if (type === 'mantenimiento') {
      this.navController.navigateForward('/tabs/entities/mantenimiento/new');
    }
  }

  private goBackToHomePage(): void {
    this.navController.navigateBack('');
  }
}

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Account } from 'src/model/account.model';
import { AccountService } from '#app/services/auth/account.service';
import { LoginService } from '#app/services/login/login.service';
import { NetworkService } from '#app/services/utils/network.service';
import { OfflineSyncService } from '#app/services/offline/offline-sync.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  account: Account;
  isLoading = false;
  online = true;

  constructor(
    public navController: NavController,
    private accountService: AccountService,
    private loginService: LoginService,
    private networkService: NetworkService,
    private offlineSyncService: OfflineSyncService,
  ) {}

  async ngOnInit() {
    this.online = await this.networkService.isOnline();

    if (this.online) {
      this.account = await this.accountService.identity();
    } else {
      this.account = null;
    }
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

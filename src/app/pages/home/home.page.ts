import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Account } from 'src/model/account.model';
import { AccountService } from '#app/services/auth/account.service';
import { LoginService } from '#app/services/login/login.service';
import { EntitiesOfflineService } from '#app/services/utils/entities-offline';
import { NetworkService } from '#app/services/utils/network.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  account: Account;

  constructor(
    public navController: NavController,
    private accountService: AccountService,
    private loginService: LoginService,
    private entititesOffline: EntitiesOfflineService,
    private networkService: NetworkService,
  ) {}

  async ngOnInit() {
    const online = await this.networkService.isOnline();

    if (online) {
      this.account = await this.accountService.identity();
    } else {
      this.account = null;
    }
  }

  async sync() {
    this.entititesOffline.loadFaenasOptions();
    await this.entititesOffline.sincronizar();
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

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Account } from 'src/model/account.model';
import { AccountService } from '#app/services/auth/account.service';
import { LoginService } from '#app/services/login/login.service';
import { EntitiesOfflineService } from '#app/services/utils/entities-offline';

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
  ) {}

  ngOnInit() {
    this.accountService.identity().then(account => {
      if (account === null) {
        this.goBackToHomePage();
      } else {
        this.account = account;
      }
    });
  }

  async sync() {
    this.entititesOffline.loadFaenasOptions();
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

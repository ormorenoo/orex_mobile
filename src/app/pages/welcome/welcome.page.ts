import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AccountService } from '#app/services/auth/account.service';
import { NetworkService } from '#app/services/utils/network.service';
import { OfflineSessionService } from '#app/services/offline/offline-session.service';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  constructor(
    private accountService: AccountService,
    private navController: NavController,
    private networkService: NetworkService,
    private offlineSessionService: OfflineSessionService,
  ) {}

  ngOnInit() {
    this.accountService.identity().then(account => {
      if (account) {
        this.navController.navigateRoot('/tabs');
      }
    });
  }

  async navegar() {
    const online = await this.networkService.isOnline();
    const offlineSession = await this.offlineSessionService.load();

    if (!online && offlineSession) {
      return;
    }

    if (!online && !offlineSession) {
      this.navController.navigateRoot('/login');
    }
  }
}

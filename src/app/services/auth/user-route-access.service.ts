import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AccountService } from './account.service';
import { OfflineSessionService } from '../offline/offline-session.service';
import { NetworkService } from '../utils/network.service';

@Injectable({
  providedIn: 'root',
})
export class UserRouteAccessService implements CanActivate {
  constructor(
    private router: Router,
    private navController: NavController,
    private accountService: AccountService,
    private offlineSessionService: OfflineSessionService,
    private networkService: NetworkService,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const authorities = route.data.authorities;
    const online = await this.networkService.isOnline();

    if (!online) {
      return this.checkOfflineAccess(authorities);
    }

    return this.checkOnlineAccess(authorities, state.url);
  }

  private checkOnlineAccess(authorities: string[], url: string): Promise<boolean> {
    return this.accountService.identity().then(account => {
      if (!authorities || authorities.length === 0) {
        return true;
      }

      if (account) {
        const hasAnyAuthority = this.accountService.hasAnyAuthority(authorities);
        if (hasAnyAuthority) {
          return true;
        }
        if (isDevMode()) {
          console.error('User has not any of required authorities: ', authorities);
        }
        return false;
      }

      this.navController.navigateRoot('/accessdenied');
      return false;
    });
  }

  private async checkOfflineAccess(authorities: string[]): Promise<boolean> {
    const hasOfflineSession = await this.offlineSessionService.exists();

    if (!hasOfflineSession) {
      this.navController.navigateRoot('/login');
      return false;
    }
    return true;
  }
}

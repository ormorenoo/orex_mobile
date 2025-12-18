import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../auth/account.service';
import { AuthServerProvider } from '../auth/auth-jwt.service';
import { OfflineSessionService } from '../offline/offline-session.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private accountService: AccountService,
    private authServerProvider: AuthServerProvider,
    private offlineSessionService: OfflineSessionService,
    private translate: TranslateService,
  ) {}

  login(credentials, callback?) {
    return new Promise((resolve, reject) => {
      this.authServerProvider.login(credentials).subscribe(
        data => {
          this.accountService.identity(true).then(account => {
            // After the login the language will be changed to
            // the language selected by the user during his registration
            // and the session will be store of offline usage
            if (account !== null) {
              this.translate.use(account.langKey);

              this.offlineSessionService.save({
                userId: account.id,
                username: account.login,
                roles: account.authorities,
                loginAt: new Date().toISOString(),
                lastOnlineAt: new Date().toISOString(),
              });
            }
            resolve(data);
          });
          return callback?.();
        },
        err => {
          this.logout();
          reject(err);
          return callback?.(err);
        },
      );
    });
  }

  loginWithToken(jwt, rememberMe) {
    return this.authServerProvider.loginWithToken(jwt, rememberMe);
  }

  logout() {
    this.authServerProvider.logout().subscribe();
    this.accountService.authenticate(null);
    this.offlineSessionService.clear();
  }
}

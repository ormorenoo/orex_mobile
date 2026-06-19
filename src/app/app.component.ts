import { Component, NgZone } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SqliteService } from './services/sqlite/sqlite.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private translate: TranslateService,
    private sqliteService: SqliteService,
    private zone: NgZone,
    private navController: NavController,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      if (Capacitor.isPluginAvailable('StatusBar')) {
        await StatusBar.setStyle({ style: Style.Default });
      }
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        await SplashScreen.hide();
      }
    });
    this.initTranslate();
    this.initDeepLinks();
  }

  /**
   * Deep link del QR de la mesa: al escanear `…/mesa-trabajo/{id}/view`
   * se abre el detalle de la mesa dentro de la app. Si no hay sesión, el
   * guard de ruta redirige a login. REQ-324-001.
   */
  initDeepLinks() {
    if (!Capacitor.isPluginAvailable('App')) {
      return;
    }
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      const match = /\/mesa-trabajo\/(\d+)\/view/.exec(event.url ?? '');
      if (match) {
        const mesaId = match[1];
        this.zone.run(() => {
          this.navController.navigateForward(`/tabs/entities/mesa-trabajo/${mesaId}/view`);
        });
      }
    });
  }

  initTranslate() {
    const enLang = 'en';

    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang(enLang);

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use(enLang); // Set your language here
    }
  }
}

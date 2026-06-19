import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApplicationUserService } from '../entities/application-user/application-user.service';
import { ApplicationUser } from '../entities/application-user/application-user.model';
import { LoginService } from '#app/services/login/login.service';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
})
export class AccountPage implements OnInit {
  user: ApplicationUser | null = null;
  loading = true;

  constructor(
    private userService: ApplicationUserService,
    private loginService: LoginService,
    private navController: NavController,
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUserProfile().subscribe({
      next: res => {
        this.user = res.body ?? null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  get nombreCompleto(): string {
    if (!this.user) {
      return '';
    }
    return [this.user.firstName, this.user.lastName, this.user.secondLastName].filter(Boolean).join(' ');
  }

  logout(): void {
    this.loginService.logout();
    this.navController.navigateRoot('');
  }
}

import { Component, OnInit } from '@angular/core';
import { ApplicationUserService } from '../entities/application-user/application-user.service';
import { ApplicationUser } from '../entities/application-user/application-user.model';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
})
export class AccountPage implements OnInit {
  user: ApplicationUser | null = null;
  loading = true;

  constructor(private userService: ApplicationUserService) {}

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
}

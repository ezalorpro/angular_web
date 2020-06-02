import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { AuthDialogService } from './auth-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private authDialog: AuthDialogService
  ) { }

  canActivate() {
    if (this.authService.isLoggedIn()) {
      return true
    } else {
      // this.router.navigate(['/login'])
      this.authDialog.loginDialog();
      return false
    }
  }
}

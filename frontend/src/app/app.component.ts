import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './auth/login/login.component';
import { AuthDialogService } from './auth/auth-dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Probando backend';
  constructor(
    public authService: AuthService,
    public authDialog: AuthDialogService
  ) { }
}

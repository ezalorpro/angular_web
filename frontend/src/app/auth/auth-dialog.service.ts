import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthDialogService {

  constructor(
    private dialog: MatDialog
  ) { }

  loginDialogOpen() {
    this.dialog.open(LoginComponent)
  }

  loginDialogClose() {
    this.dialog.closeAll()
  }
}

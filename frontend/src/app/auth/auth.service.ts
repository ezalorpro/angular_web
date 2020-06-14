import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../env';
import { Router } from '@angular/router';
import * as moment from "moment";
import { AuthDialogService } from './auth-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL: string = 'http://localhost:5000';
  redirect_url: string;
  error_message: Subject<string> = new Subject<string>();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private dialog: MatDialog,
  ) { }
  

  register(data) {
    return this.httpClient.post(`${API_URL}/register/`, data)
  }


  login(credentials: Object) {
    return this.httpClient.post(`${API_URL}/login/`, credentials).subscribe(
      res => {
        this.setSession(res)
        this.dialog.closeAll();
        if (this.redirect_url) {
          this.router.navigate([this.redirect_url])
          this.redirect_url = null
        }
      },
      error => {
        this.error_message.next('Usuario y/o contraseña invalidos.')
      }
    );
  }


  setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresAt, 'second');
    localStorage.setItem('token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem("expires_at");
    this.router.navigate(['/'])
  }


  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn()
  }


  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  } 

}

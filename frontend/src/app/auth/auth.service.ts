import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../env';
import { Router } from '@angular/router';
import * as moment from "moment";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_URL: string = 'http://localhost:5000';


  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }
  

  register(data) {
    return this.httpClient.post(`${API_URL}/register/`, data)
  }


  login(credentials: Object) {
    return this.httpClient.post(`${API_URL}/login/`, credentials)
  }


  setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresAt, 'second');
    console.log(expiresAt)
    localStorage.setItem('token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    console.log(authResult)
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem("expires_at");
    this.router.navigate(['/login'])
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

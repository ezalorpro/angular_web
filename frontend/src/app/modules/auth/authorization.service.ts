import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  jwtHelper = new JwtHelperService()

  constructor() { }

  isAuthorized(allowedRoles: string[]): boolean {
    if (allowedRoles == null || allowedRoles.length === 0) {
      return true;
    }
    const token = localStorage.getItem('token');
    const decodeToken = this.jwtHelper.decodeToken(token);
    
    if (!decodeToken) {
      console.log('Invalid token');
      return false;
    }

    return allowedRoles.some(r => decodeToken['rls'].split(',').indexOf(r) >= 0)
  }
}

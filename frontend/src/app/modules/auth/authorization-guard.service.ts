import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthorizationService } from './authorization.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuardService implements CanActivate {

  constructor(
    private router: Router,
    private authorizationService: AuthorizationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const allowedRoles = route.data.allowedRoles;
    const isAuthorized = this.authorizationService.isAuthorized(allowedRoles);

    if (!isAuthorized) {
      this.router.navigate(['/home']);
    }
    return isAuthorized;
  }
}


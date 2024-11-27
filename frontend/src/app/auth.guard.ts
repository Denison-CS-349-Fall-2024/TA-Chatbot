import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth-service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private authService: AuthService;
  private router: Router;

  constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    if (this.authService.isAuthenticated() === false) {
      this.authService.checkSessionStatus();
    }

    return true;
  }
}

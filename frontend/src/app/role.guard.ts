
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { AuthService } from './services/auth-service/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard {
  private authService: AuthService;
  private router: Router;

  constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const isProf:boolean = route.data['isProf']

    return this.authService.checkSessionStatus().pipe(
        switchMap(() => this.authService.currentUser),
        map(user => {
          if (isProf && user?.isProf) {
            return true;
          } else if (!isProf) {
            return true;
          } else {
            return this.router.parseUrl(isProf ? '/access-restricted' : '/');
          }
        })
      );
    }
}

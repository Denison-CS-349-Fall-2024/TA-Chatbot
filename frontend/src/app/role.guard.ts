import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { AuthService } from './services/auth-service/auth.service';

/**
 * Guard to check user roles and restrict access based on roles.
 */
@Injectable({ providedIn: 'root' })
export class RoleGuard {
  private authService: AuthService;
  private router: Router;

  /**
   * Constructor to inject AuthService and Router.
   * @param authService - The authentication service.
   * @param router - The router service.
   */
  constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  /**
   * Determines if a route can be activated based on user roles.
   * @param route - The activated route snapshot.
   * @param state - The router state snapshot.
   * @returns An observable, promise, or boolean indicating if the route can be activated.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isProf: boolean = route.data['isProf'];

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
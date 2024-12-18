import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth-service/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * Guard to check if the user is authenticated.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard {
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
   * Determines if a route can be activated based on authentication status.
   * @param next - The activated route snapshot.
   * @param state - The router state snapshot.
   * @returns An observable, promise, or boolean indicating if the route can be activated.
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated() === false) {
      this.authService.checkSessionStatus();
    }

    return true;
  }

 // method if you need to handle asynchronous authentication checks
  // canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
  //   return this.authService.checkSessionStatus().pipe(
  //     map(user => {
  //       if (user) {
  //         return true;
  //       }
  //       // Store the attempted URL for redirecting
  //       this.authService.redirectUrl = state.url;
  //       return this.router.createUrlTree(['/']);
  //     }),
  //     catchError(() => {
  //       return of(this.router.createUrlTree(['/']));
  //     })
  //   );
  // }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from '../../types/usertype';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) {
    // Check session status on initialization
    this.checkSessionStatus().subscribe();
  }

  /**
   * Initiates the login process.
   */
  login() {
    this.cookieService.set('userType', "instructor");
    window.location.href = `${environment.apiEndpoint}/accounts/login`;
  }

  /**
   * Checks the session status of the user.
   * 
   * @returns An observable containing the user data if authenticated, otherwise null.
   */
  checkSessionStatus(): Observable<User | null> {
    return this.http.get<User>(`${environment.apiEndpoint}/api/users/is-authenticated/`, { withCredentials: true }).pipe(
      tap((response: User) => {
        this.currentUserSubject.next(response);
      }),
      catchError(() => {
        this.login();
        return of(null);
      })
    );
  }

  /**
   * Logs out the user.
   */
  async logout() {
    try {
      await this.http.get(`${environment.apiEndpoint}/api/users/logout/`, { withCredentials: true }).toPromise();
      
      // Clear local state
      this.currentUserSubject.next(null);
      this.cookieService.delete('userType');
      this.cookieService.delete('sessionid');

      // Redirect to landing page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state and redirect even if there's an error
      this.currentUserSubject.next(null);
      window.location.href = '/';
    }
  }

  /**
   * Checks if the user is authenticated.
   * 
   * @returns True if the user is authenticated, otherwise false.
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Checks if the user is a professor.
   * 
   * @returns True if the user is a professor, otherwise false.
   */
  isProfessor(): boolean {
    return this.currentUserSubject.value?.isProf === true;
  }

  /**
   * Gets the email of the current user.
   * 
   * @returns The email of the current user.
   */
  getEmail() {
    return this.currentUserSubject.value?.email;
  }

  /**
   * Gets the ID of the current user.
   * 
   * @returns The ID of the current user.
   */
  getId() {
    return this.currentUserSubject.value?.id;
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from '../../types/usertype';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) {
    //this.getUser()
    this.checkSessionStatus().subscribe();
  }

  login() {
    this.cookieService.set('userType', "instructor" );
    window.location.href = 'http://127.0.0.1:8000/accounts/login';
  }

    checkSessionStatus(): Observable<User | null> {

    return this.http.get<User>('http://127.0.0.1:8000/api/users/is-authenticated/', { withCredentials: true }).pipe(
      tap((response: User) => {
        this.currentUserSubject.next(response);
      }),
      catchError(() => {
        this.login();
        return of(null);
      })
    );
  }

  async logout() {
    try {

      await this.http.get('http://127.0.0.1:8000/api/users/logout/', { 
        withCredentials: true 
      }).toPromise();
      
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

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isProfessor(): boolean {
    return this.currentUserSubject.value?.isProf === true;
  }

  getEmail() {
    return this.currentUserSubject.value?.email;
  }

  getId() {
    return this.currentUserSubject.value?.id;
  }

}

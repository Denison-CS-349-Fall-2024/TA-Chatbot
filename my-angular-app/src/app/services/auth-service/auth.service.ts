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

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.checkSessionStatus().subscribe();
  }

  // Attempt to log in with credentials; redirect if successful
  login(username: string, password: string) {
    this.http.post('http://127.0.0.1:8000/accounts/login/', { username, password }, { withCredentials: true })
      .pipe(
        tap(() => {
          // Check session status right after login to verify success
          this.checkSessionStatus().subscribe();
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          return of(null);
        })
      ).subscribe();
  }

  // Checks if there’s an active session by calling the Django API
  checkSessionStatus(): Observable<User | null> {
    return this.http.get<User>('http://127.0.0.1:8000/api/users/is-authenticated/', { withCredentials: true })
      .pipe(
        tap((response: User) => {
          this.currentUserSubject.next(response);
        }),
        catchError((error) => {
          console.error('Session check failed:', error);
          this.router.navigate(['/login']); // Redirect to Angular login page if session check fails
          return of(null);
        })
      );
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isProfessor(): boolean {
    return this.currentUserSubject.value?.isProf === true;
  }

  getEmail(){
    return this.currentUserSubject.value?.email;
  }

  getId(){
    return this.currentUserSubject.value?.id;
  }
}

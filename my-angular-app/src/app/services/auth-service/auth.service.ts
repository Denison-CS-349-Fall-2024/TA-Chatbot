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
    window.location.href = 'http://127.0.0.1:8000/accounts/login';
  }

    checkSessionStatus(): Observable<User | null> {
    return this.http.get<User>('http://127.0.0.1:8000/getuser', { withCredentials: true }).pipe(
      tap((response: User) => {
        this.currentUserSubject.next(response);
      }),
      catchError(() => {
        this.login();
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

}

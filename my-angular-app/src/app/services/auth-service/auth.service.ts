import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.getUser()
  }
  
  async getUser(){
    this.cookieService.set('userType', "student" );
    this.http.get<any[]>("http://127.0.0.1:8000/getuser/")
    .pipe(
      tap(res => console.log(res)), 
      catchError(error => {
        console.error('Error fetching user data:', error);
          window.location.href = "http://127.0.0.1:8000/accounts/login";
        return of([]); // Return an empty array or handle the error accordingly
      })
    ).subscribe()
  }
}

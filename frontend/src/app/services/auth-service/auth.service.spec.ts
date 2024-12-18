import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [CookieService]
    });
    service = TestBed.inject(AuthService);
  });

  /**
   * Test to check if the service is created.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test to check if the user is authenticated.
   */
  it('should check if the user is authenticated', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  /**
   * Test to check if the user is a professor.
   */
  it('should check if the user is a professor', () => {
    expect(service.isProfessor()).toBeFalse();
  });

  /**
   * Test to check if the login method sets the userType cookie.
   */
  it('should set userType cookie on login', () => {
    const cookieService = TestBed.inject(CookieService);
    service.login();
    expect(cookieService.get('userType')).toBe('instructor');
  });
});
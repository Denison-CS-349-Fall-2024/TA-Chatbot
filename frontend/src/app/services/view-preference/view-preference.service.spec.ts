import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { ViewPreferenceService } from './view-preference.service';

describe('ViewPreferenceService', () => {
  let service: ViewPreferenceService;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookieService]
    });
    service = TestBed.inject(ViewPreferenceService);
    cookieService = TestBed.inject(CookieService);
  });

  /**
   * Test to check if the service is created.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test to check if the default view mode is 'grid'.
   */
  it('should have default view mode as grid', () => {
    expect(service.getViewMode()).toBe('grid');
  });

  /**
   * Test to check if the view mode can be set to 'list'.
   */
  it('should set view mode to list', () => {
    service.setViewMode('list');
    expect(service.getViewMode()).toBe('list');
  });

  /**
   * Test to check if the view mode is saved in cookies.
   */
  it('should save view mode in cookies', () => {
    service.setViewMode('list');
    expect(cookieService.get('courseViewPreference')).toBe('list');
  });
});
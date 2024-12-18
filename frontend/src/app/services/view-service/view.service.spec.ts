import { TestBed } from '@angular/core/testing';
import { ViewService } from './view.service';

describe('ViewService', () => {
  let service: ViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewService);
  });

  /**
   * Test to check if the service is created.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test to check if the default view mode is 'instructor'.
   */
  it('should have default view mode as instructor', () => {
    expect(service.getViewMode()).toBe('instructor');
  });

  /**
   * Test to check if the view mode can be set to 'student'.
   */
  it('should set view mode to student', () => {
    service.setViewMode('student');
    expect(service.getViewMode()).toBe('student');
  });
});
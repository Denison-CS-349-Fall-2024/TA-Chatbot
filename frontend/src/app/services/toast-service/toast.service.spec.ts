import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  /**
   * Test to check if the service is created.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test to check if a toast can be shown.
   */
  it('should show a toast', () => {
    const toastId = service.show('success', 'Test Title', 'Test Message');
    service.toasts$.subscribe(toasts => {
      expect(toasts.length).toBe(1);
      expect(toasts[0].id).toBe(toastId);
      expect(toasts[0].title).toBe('Test Title');
      expect(toasts[0].message).toBe('Test Message');
    });
  });

  /**
   * Test to check if a toast can be dismissed.
   */
  it('should dismiss a toast', () => {
    const toastId = service.show('success', 'Test Title', 'Test Message');
    service.dismiss(toastId);
    service.toasts$.subscribe(toasts => {
      expect(toasts.length).toBe(0);
    });
  });
});
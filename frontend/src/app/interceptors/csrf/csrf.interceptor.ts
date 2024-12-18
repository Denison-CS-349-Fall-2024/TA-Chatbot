import { HttpInterceptorFn } from '@angular/common/http';

/**
 * CSRF interceptor to add credentials to HTTP requests.
 */
export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const updatedRequest = req.clone({
    withCredentials: true
  });
  return next(updatedRequest);
};
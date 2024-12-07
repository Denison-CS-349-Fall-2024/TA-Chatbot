import { HttpInterceptorFn } from '@angular/common/http';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  
    const updatedRequest=req.clone({
      withCredentials:true
    })
    return next(updatedRequest);
  
};

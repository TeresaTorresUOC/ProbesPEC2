import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { selectAccessToken } from '../selectors/auth.selectors';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    return this.store.select(selectAccessToken).pipe(
      take(1), 
      switchMap((token) => {
        if (token) {
         
          const clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next.handle(clonedReq);
        } else {
        
          return next.handle(req);
        }
      })
    );
  }
}

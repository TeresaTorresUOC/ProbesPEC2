import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AppState } from '../../app.reducer';
import { selectAccessToken } from '../selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(selectAccessToken).pipe(
      take(1),
      map((token) => {
        if (token) {
         
          return true;
        }
       
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}

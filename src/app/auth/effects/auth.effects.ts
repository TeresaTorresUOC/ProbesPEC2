import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../services/auth.service';
import * as AuthActions from '../actions/auth.actions'; 
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import { AuthDTO } from '../models/auth.dto';
import { LocalStorageService } from '../../Services/local-storage.service';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      mergeMap((action) =>
        this.authService.login({ email: action.email, password: action.password }).pipe(
          map((response) => {
            const authData = new AuthDTO(response.userId, response.access_token);
            return AuthActions.loginSuccess({ auth: authData });
          }),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );

  persistCredentials$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ auth }) => {
          this.localStorageService.set('userId', auth.userId.toString());
          this.localStorageService.set('access_token', auth.access_token);
        })
      ),
    { dispatch: false }
  );

  clearCredentials$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.localStorageService.remove('userId');
          this.localStorageService.remove('access_token');
        })
      ),
    { dispatch: false }
  );

  restoreCredentials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      mergeMap(() => {
        const accessToken = this.localStorageService.get('access_token');
        const userId = this.localStorageService.get('userId');

        if (accessToken && userId) {
          const authData = new AuthDTO(userId, accessToken);
          return of(AuthActions.loginSuccess({ auth: authData }));
        }

        return EMPTY;
      })
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}
}

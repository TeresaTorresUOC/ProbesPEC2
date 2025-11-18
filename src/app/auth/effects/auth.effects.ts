import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../services/auth.service';
import * as AuthActions from '../actions/auth.actions'; 
import { map, mergeMap, catchError } from 'rxjs/operators'; 
import { of } from 'rxjs'; 
import { AuthDTO } from '../models/auth.dto';


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

  constructor(private actions$: Actions, private authService: AuthService) {}
}

import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { AuthDTO } from '../models/auth.dto';


export interface AuthState {
  credentials: AuthDTO | null;
  loading: boolean;
  loaded: boolean;
  error: any;
}

export const initialState: AuthState = {
  credentials: null,
  loading: false,
  loaded: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.loginStart, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { auth }) => ({
    ...state,
    credentials: auth,
    loading: false,
    loaded: true,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error,
  })),

  on(AuthActions.logout, () => initialState)
);

import { ActionReducerMap } from '@ngrx/store';
import { AuthState } from './auth/reducers/auth.reducer';
import { authReducer } from './auth/reducers/auth.reducer';


export interface AppState {
  auth: AuthState;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
};

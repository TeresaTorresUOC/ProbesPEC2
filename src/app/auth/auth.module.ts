import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from './reducers/auth.reducer';
import { AuthEffects } from './effects/auth.effects';


import { LoginComponent } from '../auth/component/login.component';


@NgModule({
  declarations: [
    LoginComponent,
    
  ],
  imports: [
    CommonModule,            
    FormsModule,             
    ReactiveFormsModule,     
    StoreModule.forFeature('auth', authReducer), 
    EffectsModule.forFeature([AuthEffects]),     
  ],
  exports: [
    LoginComponent,         
  ],
})
export class AuthModule {}


import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../auth/actions/auth.actions';
import { AuthState } from '../../auth/reducers/auth.reducer';
import { AuthService } from '../../auth/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<{ auth: AuthState }>,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.notificationService.showInfo('Iniciant sessió...');

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.store.dispatch(
          login({
            userId: response.userId,
            access_token: response.access_token
          })
        );
        this.isSubmitting = false;
        this.notificationService.showSuccess('Sessió iniciada correctament');
      },
      error: () => {
        this.errorMessage = 'Error d’autenticació. Revisa les credencials.';
        this.isSubmitting = false;
        this.notificationService.showError('Error d’autenticació. Revisa les credencials.');
      }
    });
  }
}

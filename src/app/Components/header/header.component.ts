import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { logout } from '../../auth/actions/auth.actions';
import { Observable } from 'rxjs';
import { AuthState } from '../../auth/reducers/auth.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showAuthSection = false;
  showNoAuthSection = true;
  authState$: Observable<AuthState>;

  constructor(private router: Router, private store: Store<AppState>) {
    this.authState$ = this.store.select('auth');
  }

  ngOnInit(): void {
    this.authState$.subscribe((auth) => {
      if (auth.credentials) {
       
        this.showAuthSection = true;
        this.showNoAuthSection = false;
      } else {
        this.showAuthSection = false;
        this.showNoAuthSection = true;
      }
    });
  }

  home(): void {
    this.router.navigateByUrl('home');
  }

  login(): void {
    this.router.navigateByUrl('login');
  }

  register(): void {
    this.router.navigateByUrl('register');
  }

  adminPosts(): void {
    this.router.navigateByUrl('user/posts');
  }

  adminCategories(): void {
    this.router.navigateByUrl('user/categories');
  }

  profile(): void {
    this.router.navigateByUrl('profile');
  }

  dashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }

  logout(): void {
    this.store.dispatch(logout());
    this.router.navigateByUrl('home');
  }
}

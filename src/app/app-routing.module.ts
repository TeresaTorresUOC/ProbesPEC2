import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from '../app/auth/component/login.component'; 
import { RegisterComponent } from './Components/register/register.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { PostsListComponent } from './Components/posts/posts-list/posts-list.component';
import { PostFormComponent } from './Components/posts/post-form/post-form.component';
import { CategoriesListComponent } from './Components/categories/categories-list/categories-list.component';
import { CategoryFormComponent } from './Components/categories/category-form/category-form.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';


import { AuthGuard } from './Guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

 
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'user/posts', component: PostsListComponent, canActivate: [AuthGuard] },
  { path: 'user/post/:id', component: PostFormComponent, canActivate: [AuthGuard] },
  { path: 'user/post', component: PostFormComponent, canActivate: [AuthGuard] },
  { path: 'user/categories', component: CategoriesListComponent, canActivate: [AuthGuard] },
  { path: 'user/category/:id', component: CategoryFormComponent, canActivate: [AuthGuard] },
  { path: 'user/category', component: CategoryFormComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },


  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { AuthGuardService } from './modules/auth/auth-guard.service';
import { SuccesMessageComponent } from './modules/auth/succes-message/succes-message.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileViewComponent } from './modules/profile/profile-view/profile-view.component';
import { ProfileEditComponent } from './modules/profile/profile-edit/profile-edit.component';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo:'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'profile', component: ProfileViewComponent, canActivate: [AuthGuardService] },
  { path: 'edit_profile', component: ProfileEditComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register_succes', component: SuccesMessageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

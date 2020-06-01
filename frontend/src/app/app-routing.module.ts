import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersDataComponent } from './components/users-data/users-data.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuardService } from './auth/auth-guard.service';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'user-data', component: UsersDataComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

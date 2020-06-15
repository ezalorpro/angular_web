import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuardService } from './modules/auth/auth-guard.service';
import { HomeComponent } from './components/home/home.component';


const routes: Routes = [
  { path: 'pokedex', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo:'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  {
    path: 'profile',
    loadChildren: './modules/profile/profile.module#ProfileModule'
  },
  {
    path: 'register',
    loadChildren: './modules/auth/auth.module#AuthModule'
  },
  {
    path: '**',
    loadChildren: './modules/generic/generic.module#GenericModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

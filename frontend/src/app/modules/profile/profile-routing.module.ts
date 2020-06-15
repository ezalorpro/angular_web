import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { AuthGuardService } from '../auth/auth-guard.service';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'view',
        pathMatch: 'full'
    },
    {
        path: 'view',
        component: ProfileViewComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'edit',
        component: ProfileEditComponent,
        canActivate: [AuthGuardService]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
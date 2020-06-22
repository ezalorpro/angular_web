import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostViewComponent } from './post-view/post-view.component';
import { AuthGuardService } from '../auth/auth-guard.service';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostNewComponent } from './post-new/post-new.component';
import { AuthorizationGuardService } from '../auth/authorization-guard.service';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'new',
    pathMatch: 'full',
    canActivate: [AuthGuardService]
  },
  {
    path: 'view/:id',
    component: PostViewComponent,
  },
  {
    path: 'edit/:id',
    component: PostEditComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'new',
    component: PostNewComponent,
    data: {
    allowedRoles: ['ROLE_ADMIN', 'ROLE_EDITOR']
    },
    canActivate: [AuthGuardService, AuthorizationGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogPostsRoutingModule { }

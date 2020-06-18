import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostViewComponent } from './post-view/post-view.component';
import { PostListComponent } from './post-list/post-list.component';
import { AuthGuardService } from '../auth/auth-guard.service';
import { PostEditComponent } from './post-edit/post-edit.component';
import { PostNewComponent } from './post-new/post-new.component';


const routes: Routes = [
  {
    path: '',
    component: PostListComponent,
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
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogPostsRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostViewComponent } from './post-view/post-view.component';
import { PostListComponent } from './post-list/post-list.component';
import { AuthGuardService } from '../auth/auth-guard.service';


const routes: Routes = [
  {
    path: '',
    component: PostListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'view/:id',
    component: PostViewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogPostsRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogPostsRoutingModule } from './blog-posts-routing.module';
import { CommentComponent } from './comment/comment.component';
import { PostContentComponent } from './post-content/post-content.component';
import { PostViewComponent } from './post-view/post-view.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { SafePipe } from 'src/app/pipes/safe.pipe';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContentTagComponent } from './content-tag/content-tag.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { TagInputComponent } from './tag-input/tag-input.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostNewComponent } from './post-new/post-new.component';
import { DeletePostComponent } from './delete-post/delete-post.component';
import { DeleteCommentComponent } from './delete-comment/delete-comment.component';


@NgModule({
  declarations: [
    CommentComponent,
    PostContentComponent,
    PostViewComponent,
    PostEditComponent,
    SafePipe,
    ContentTagComponent,
    TagInputComponent,
    PostNewComponent,
    DeletePostComponent,
    DeleteCommentComponent
  ],
  imports: [
    CommonModule,
    BlogPostsRoutingModule,
    FlexLayoutModule,
    EditorModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BlogPostsModule { }

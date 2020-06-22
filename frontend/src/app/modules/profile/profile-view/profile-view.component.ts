import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { UserData } from 'src/app/models/userdata.model';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ModalDialogService } from 'src/app/services/modal-dialog.service';
import { DeletePostComponent } from '../../blog-posts/delete-post/delete-post.component';
import { FadeInOutAnimation } from 'src/app/animations/generic.animation';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css'],
  animations: [FadeInOutAnimation()]
})
export class ProfileViewComponent implements OnInit {

  userdata: UserData;
  userdata_subscription: Subscription;
  posts: Post[] = [];

  constructor(
    private restService: RestService,
    private router: Router,
    private modalDialogService: ModalDialogService
  ) { 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload'
  }

  ngOnInit(): void {
    this.userdata_subscription = this.restService.getUserData().pipe(
      switchMap(userdata => {
        this.userdata = userdata
        return this.restService.apiPostData(userdata.username, null, 'get')
      })
    ).subscribe(
      res => {
        this.posts = res
        console.log(this.posts)
      },
      error => {
        console.log('error:', error)
      }
    )    
  }

  deletePost(data) {
    this.modalDialogService.generalDialogOpen(DeletePostComponent, data)
  }

  ngOnDestroy() {
    this.userdata_subscription.unsubscribe()
  }

}

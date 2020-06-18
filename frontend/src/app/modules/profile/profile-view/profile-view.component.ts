import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { UserData } from 'src/app/models/userdata.model';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  userdata: UserData;
  userdata_subscription: Subscription;
  posts: Post[];

  constructor(private restService: RestService) { }

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

  ngOnDestroy() {
    this.userdata_subscription.unsubscribe()
  }

}

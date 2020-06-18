import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { Post } from 'src/app/models/post.model';
import { UserData } from 'src/app/models/userdata.model';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Post[];
  userdata: UserData;

  constructor(
    private restService: RestService,
    private authService: AuthService,
    private router: Router
  ) { 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload'
  }

  ngOnInit(): void {
    this.restService.apiPostData(null, null, 'get').subscribe(
      res => {
        this.posts = res
        console.log(this.posts)
      },
      error => {
        console.log('error:', error)
      }
    )
    if (this.authService.isLoggedIn()) {
      this.restService.getUserData().subscribe(
        res => {
          this.userdata = res
          console.log(this.userdata)
        },
        error => {
          console.log(error)
        }
      )
    }
  }

}

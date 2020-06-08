import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';
import { Post } from 'src/app/models/post.model';
import { UserData } from 'src/app/models/userdata.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Post[];
  userdata: UserData;

  constructor(private restService: RestService) { }

  ngOnInit(): void {
    this.restService.getPosts().subscribe(
      res => {
        this.posts = res
        console.log(res)
      },
      error => {
        console.log('error:', error)
      }
    )
    this.restService.getUserData().subscribe(
      res => {
        this.userdata = res
      }
    )
  }

}

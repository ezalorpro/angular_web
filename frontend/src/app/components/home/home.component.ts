import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  posts: Post[];

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
  }

}

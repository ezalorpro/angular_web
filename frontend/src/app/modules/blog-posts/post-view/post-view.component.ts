import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RestService } from 'src/app/services/rest.service';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit {

  post_data: Post;

  constructor(
    private route: ActivatedRoute,
    private restService: RestService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(param => {
        return this.restService.apiPostData(param['id'], null, 'get')
      })
    ).subscribe(
      data => {
        console.log(data)
        this.post_data = data
      }
    )
  }

}

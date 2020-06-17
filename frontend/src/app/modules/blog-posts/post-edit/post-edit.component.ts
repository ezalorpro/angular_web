import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { Post } from 'src/app/models/post.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  post_data: Post;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(param => {
        return this.restService.getPostData(param['id'])
      })
    ).subscribe(
      data => {
        this.post_data = data
        this.form = this.formBuilder.group({
          title: [this.post_data.title, [Validators.required, Validators.minLength(4)]],
          post_text: '',
          tags: this.post_data.tags,
        })
      }
    )
  }

}

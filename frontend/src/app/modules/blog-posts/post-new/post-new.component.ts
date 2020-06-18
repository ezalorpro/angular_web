import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css']
})
export class PostNewComponent implements OnInit {

  form: FormGroup;
  allTags: Array<string>;
  current_tags: Array<string> = [];
  title_uniq_error: string;

  constructor(
    private restService: RestService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      post_text: [''],
      tags: [this.current_tags, [Validators.required]],
    })

    this.restService.getTags().pipe(
      map((tags) => tags.map(tag => tag.name))
    ).subscribe(
      tags => this.allTags = tags
    )
  }

  crear(data) {
    this.restService.PostPosts(data, 'new').subscribe(
      res => {
        this.router.navigate([res['redirect']])
        console.log(res)
      },
      error => {
        console.log(error)
        if (error.status == 409) {
          this.title_uniq_error = error.error.message
        } else {
          alert(error.error.message)
        }
      }
    )
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RestService } from 'src/app/services/rest.service';
import { Post } from 'src/app/models/post.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ScrollService } from 'src/app/services/scroll.service';
import { Observable, Subscription, of } from 'rxjs';
import { Comment } from 'src/app/models/comment.model';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit {

  post_data: Post;
  form: FormGroup;
  alternate: boolean;
  comments: Observable<any>;
  comments_subscription: Subscription;
  no_comments: boolean;
  commets_error: boolean;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    private formBuilder: FormBuilder,
    private scrollService: ScrollService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(param => {
        this.subscribeScroll(param['id'])
        return this.restService.apiPostData(param['id'], null, 'get')
      })
    ).subscribe(
      data => {
        console.log(data)
        this.post_data = data
        this.form = this.formBuilder.group({
          content: ''
        })
      }
    )
  }

  nuevoComentario(data) {
    console.log(data)
  }

  tinymceInit() {
    return {
      plugins: 'advlist lists',
      height: "180",
      menubar: '',
      toolbar: 'undo redo | bold italic underline strikethrough | fontsizeselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist '
    }
  }

  alternar(event) {
    this.alternate = event
  }

  getComments(post_id) {
    if (!this.loading) {
      this.restService.apiCommentsData(post_id, null, 'get').subscribe(
        data => {
          console.log(data)
          console.log(data.length)
          if (data.length) {
            this.comments = of(data)
            this.no_comments = false
            this.loading = false
            if (this.comments_subscription) {
              this.comments_subscription.unsubscribe()
            }
          } else {
            this.no_comments = true
            this.loading = false
          }
        },
        error => {
          this.commets_error = true
          this.no_comments = true
          this.loading = false
        }
      )
    }
  }

  subscribeScroll(post_id) {
    this.comments_subscription = this.scrollService.getScrollEventLater().subscribe(
      () => {
        this.getComments(post_id)
      },
      () => {
        
      }
    )
  }

  ngOnDestroy() {
    if (this.comments_subscription) {
      this.comments_subscription.unsubscribe()
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RestService } from 'src/app/services/rest.service';
import { Post } from 'src/app/models/post.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScrollService } from 'src/app/services/scroll.service';
import { Observable, Subscription, of } from 'rxjs';
import { Comment } from 'src/app/models/comment.model';
import { UserData } from 'src/app/models/userdata.model';
import { AuthService } from '../../auth/auth.service';
import { ModalDialogService } from 'src/app/services/modal-dialog.service';
import { FadeInOutAnimation } from 'src/app/animations/generic.animation';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css'],
  animations: [FadeInOutAnimation()]
})
export class PostViewComponent implements OnInit {

  post_data: Post;
  form: FormGroup;
  alternate: boolean;
  comments: Observable<any>;
  comments_subscription: Subscription;
  update_comments_subscription: Subscription;
  no_comments: boolean;
  commets_error: boolean;
  loading: boolean = false;
  userdata: UserData;

  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    private formBuilder: FormBuilder,
    private scrollService: ScrollService,
    private authService: AuthService,
    private modalDialogService: ModalDialogService,
    private router: Router
  ) { 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload'
  }

  ngOnInit(): void {
    if(this.authService.isLoggedIn())
    this.restService.getUserData().subscribe(
      data => this.userdata = data
    )

    this.route.params.pipe(
      switchMap(param => {
        this.subscribeScroll(param['id'])
        return this.restService.apiPostData(param['id'], null, 'get')
      })
    ).subscribe(
      data => {
        this.post_data = data
        this.form = this.formBuilder.group({
          content: ['', Validators.required]
        })
      }
    )
    

  }

  nuevoComentario(data) {
    this.restService.apiCommentsData(this.post_data.id, data, 'post').subscribe(
      data => {
        this.form.controls['content'].setValue('')
        this.getComments(this.post_data.id, true)
      },
      error => {
        console.log(error)
      }
    )
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

  getComments(post_id, forceRefresh: boolean = false) {
    if (!this.loading) {
      this.loading = true
      this.restService.apiCommentsData(post_id, null, 'get', forceRefresh).subscribe(
        data => {
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
            if (this.comments_subscription) {
              this.comments_subscription.unsubscribe()
            }
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
        this.update_comments_subscription = this.modalDialogService.getGenericSubject()
          .subscribe(
            () => this.getComments(post_id, true)
          )
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

    if (this.update_comments_subscription) {
      this.update_comments_subscription.unsubscribe()
    }
  }
}

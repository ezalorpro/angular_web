import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RestService } from 'src/app/services/rest.service';
import { Post } from 'src/app/models/post.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit {

  post_data: Post;
  form: FormGroup;
  alternate: boolean;

  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    private formBuilder: FormBuilder
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
}

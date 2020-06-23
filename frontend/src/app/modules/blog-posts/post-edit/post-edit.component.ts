import { Component, OnInit } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from 'src/app/services/rest.service';
import { Post } from 'src/app/models/post.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API_URL } from "../../../env";

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  post_data: Post;
  form: FormGroup;
  allTags: Array<string>;
  current_tags: Array<string> = [];
  title_uniq_error: string;
  api_url = API_URL

  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(param => {
        return this.restService.apiPostData(param['id'], null, 'get')
      })
    ).subscribe(
      data => {
        this.post_data = data
        this.post_data.tags.forEach(element => {
          this.current_tags.push(element.name)
        });

        this.form = this.formBuilder.group({
          title: [this.post_data.title, [Validators.required, Validators.minLength(4)]],
          post_text: [this.post_data.post_text],
          tags: [this.current_tags, [Validators.required]],
        })
      }
    )

    this.restService.getTags().pipe(
      map((tags) => tags.map(tag => tag.name))
    ).subscribe(
      tags => this.allTags = tags
    )
  }

  editar(data) {
    data['id'] = this.post_data.id
    this.restService.apiPostData(null, data, 'put').subscribe(
      res => {
        this.router.navigate([res['redirect']])
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

  tinymceInit() {
    return {
      plugins: 'codesample image code table anchor charmap directionality emoticons hr imagetools insertdatetime media importcss nonbreaking pagebreak paste preview print quickbars save searchreplace toc visualblocks wordcount visualchars',
      image_title: true,
      image_advtab: true,
      convert_urls: false,
      height: '400',
      automatic_uploads: true,
      images_upload_url:`${this.api_url}/post_image_handler/`,
      media_live_embeds: true,
      codesample_global_prismjs: true,
      table_responsive_width: true,
      images_upload_handler: function (blobInfo, success, failure) {
        var xhr, formData;
        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        const token: string = localStorage.getItem('token')
        xhr.open('POST', `${this.api_url}/post_image_handler/`);
        xhr.setRequestHeader("authorization", `Bearer ${token}`);
        xhr.onload = function () {
          var json;
          if (xhr.status != 200) {
            failure('HTTP Error: ' + xhr.status);
            return;
          }
          json = JSON.parse(xhr.responseText);

          if (!json || typeof json.location != 'string') {
            failure('Invalid JSON: ' + xhr.responseText);
            return;
          }
          success(json.location);
        };
        formData = new FormData();
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        xhr.send(formData);
      }
    }
  }

}

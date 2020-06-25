import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from 'src/app/models/comment.model';
import { UserData } from 'src/app/models/userdata.model';
import { ModalDialogService } from 'src/app/services/modal-dialog.service';
import { DeleteCommentComponent } from '../delete-comment/delete-comment.component';
import { RestService } from 'src/app/services/rest.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { FadeInOutAnimation } from 'src/app/animations/generic.animation';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  animations: [FadeInOutAnimation()]
})
export class CommentComponent implements OnInit {

  alternate: boolean = false;
  @Output() alternate_emmiter: EventEmitter<any> = new EventEmitter();
  @Input() comment_data: Comment;
  @Input() userdata?: UserData
  userdata_comment: UserData;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalDialogService: ModalDialogService,
    private restService: RestService
  ) { }

  ngOnInit(): void {
    this.alternate_emmiter.emit(this.alternate)
    this.form = this.formBuilder.group({
      content: [this.comment_data['content'], Validators.required]
    })
    this.userdata_comment = this.comment_data.user
  }

  tinymceInit() {
    return {
      plugins: 'advlist lists autoresize',
      height: "180",
      menubar: '',
      toolbar: 'undo redo | bold italic underline strikethrough | fontsizeselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist '
    }
  }

  alternar() {
    this.alternate = this.alternate ? false : true;
    this.alternate_emmiter.emit(this.alternate)
  }

  editar(data) {
    data['post'] = this.comment_data.post
    this.restService.apiCommentsData(this.comment_data.id, data, 'put').subscribe(
      data => {
        this.modalDialogService.setGenericSubject(true)
      },
      error => {
        console.log(error)
      }
    )
  }

  delete() {
    this.modalDialogService.generalDialogOpen(DeleteCommentComponent, this.comment_data)
  }

}

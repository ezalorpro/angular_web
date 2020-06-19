import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Comment } from 'src/app/models/comment.model';
import { UserData } from 'src/app/models/userdata.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  alternate: boolean = false;
  @Output() alternate_emmiter: EventEmitter<any> = new EventEmitter();
  @Input() comment_data: Comment;
  userdata: UserData;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.alternate_emmiter.emit(this.alternate)
    this.form = this.formBuilder.group({
      content: this.comment_data['content']
    })
    this.userdata = this.comment_data.user
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
    console.log(data)
  }

}

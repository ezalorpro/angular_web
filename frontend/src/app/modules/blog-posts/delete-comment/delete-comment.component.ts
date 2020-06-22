import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ModalDialogService } from 'src/app/services/modal-dialog.service';

@Component({
  selector: 'app-delete-comment',
  templateUrl: './delete-comment.component.html',
  styleUrls: ['./delete-comment.component.css']
})
export class DeleteCommentComponent implements OnInit {

  delete_subscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<DeleteCommentComponent>,
    private restService: RestService,
    private router: Router,
    private modalDialogService: ModalDialogService
  ) { }

  ngOnInit(): void {
  }

  onClose() {
    this.dialogRef.close();
  }

  delete() {
    this.delete_subscription = this.restService.apiCommentsData(this.data['id'], null, 'delete')
      .subscribe(
        () => {
          this.modalDialogService.setGenericSubject(true)
          this.dialogRef.close()
        },
        error => {
          console.log(error)
        }
      )
  }

  ngOnDestroy() {
    if (this.delete_subscription)
      this.delete_subscription.unsubscribe()
  }

}
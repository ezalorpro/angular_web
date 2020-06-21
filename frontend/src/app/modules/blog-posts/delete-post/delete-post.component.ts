import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestService } from 'src/app/services/rest.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-post',
  templateUrl: './delete-post.component.html',
  styleUrls: ['./delete-post.component.css']
})
export class DeletePostComponent implements OnInit {

  delete_subscription: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<DeletePostComponent>,
    private restService: RestService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onClose() {
    this.dialogRef.close();
  }

  delete() {
    this.delete_subscription = this.restService.apiPostData(this.data['id'], null, 'delete')
      .subscribe(
        () => { 
          this.dialogRef.close()
          this.router.navigateByUrl(this.router.url)
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

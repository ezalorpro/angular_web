import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { Data } from '../models/data.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users-data',
  templateUrl: './users-data.component.html',
  styleUrls: ['./users-data.component.css']
})
export class UsersDataComponent implements OnInit {

  dataSub: Subscription;
  user_data: Data[];
  headers = ['usuario', 'first_name', 'last_name', 'email'];

  constructor(private restService: RestService) { }

  ngOnInit(): void {
    this.dataSub = this.restService
      .getData()
      .subscribe(
        res => {
          this.user_data = res['data'];
        },
        error => {
          console.log('oops', error)
        }
      );
  }

  ngOnDestroy() {
    this.dataSub.unsubscribe();
  }

}

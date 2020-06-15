import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { UserData } from 'src/app/models/userdata.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  userdata: UserData;
  userdata_subscription: Subscription;

  constructor(private restService: RestService) { }

  ngOnInit(): void {
    this.userdata_subscription = this.restService.getUserData()
      .subscribe(
        res => {
          this.userdata = res;
      }
    )
  }

  ngOnDestroy() {
    this.userdata_subscription.unsubscribe()
  }

}

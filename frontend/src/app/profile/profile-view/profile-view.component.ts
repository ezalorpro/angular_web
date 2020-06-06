import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';
import { UserData } from 'src/app/models/userdata.model';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {

  userdata: UserData;

  constructor(private restService: RestService) { }

  ngOnInit(): void {
    this.restService.getUserData()
      .subscribe(
        res => {
          this.userdata = res;
          console.log(this.userdata)
      }
    )
  }

}

import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import { UserData } from 'src/app/models/userdata.model';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FadeInOutAnimation } from 'src/app/animations/generic.animation';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  animations: [FadeInOutAnimation()]
})
export class ProfileEditComponent implements OnInit {

  form;
  error: string;
  avatar;
  avatar_file;
  userdata_subscription: Subscription;
  onUpdate_subscription: Subscription;

  constructor(
    private rest: RestService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userdata_subscription = this.rest.getUserData().subscribe(
      res => {
        this.form = this.formBuilder.group({
          avatar: '',
          first_name: res['first_name'],
          last_name: res['last_name'],
          email: [res['email'], [Validators.email, Validators.required]],
          gender: res['gender'],
          location: res['location'],
          information: res['information']
        })
        this.avatar = res['avatar_url']
      }
    )
  }
  

  onUpdate(data: UserData) {
    this.onUpdate_subscription = this.rest.postUserData(data, this.avatar_file).subscribe(
      res => {
        this.router.navigate([res['redirect']])
      },
      error => {
        this.error = error.error.message;
      });
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      
      reader.onload = () => {
        this.avatar = reader.result
        this.avatar_file = { data: reader.result as string, name: file.name }
      };
      
    }
  }

  ngOnDestroy() {
    this.userdata_subscription.unsubscribe()
    if (this.onUpdate_subscription) {
      this.onUpdate_subscription.unsubscribe()
    }
  }

}

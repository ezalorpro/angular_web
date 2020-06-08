import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';
import { UserData } from 'src/app/models/userdata.model';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  form;
  error: string;
  avatar: string;
  avatar_file;

  constructor(
    private rest: RestService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.rest.getUserData().subscribe(
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
    console.log(data)
    return this.rest.postUserData(data, this.avatar_file).subscribe(
      res => {
        this.router.navigate([res['redirect']])
      },
      error => {
        console.log(error)
        this.error = error.error.message;
      });
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.avatar = reader.result as string;
        console.log(this.avatar)
        this.avatar_file = { data: this.avatar, name: file.name }
      };

    }
  }

}

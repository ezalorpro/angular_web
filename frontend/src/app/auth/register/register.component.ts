import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      username: '',
      email: '',
      password: ''
    })
   }

  ngOnInit(): void {
  }

  register(data) {
    return this.authService.register(data);
  }

}

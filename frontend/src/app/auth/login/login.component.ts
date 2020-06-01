import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { 
    this.form = this.formBuilder.group({
      username: '',
      password: ''
    })
  }

  ngOnInit(): void {
  }

  login(credentials) {
    this.authService.login(credentials)
  }
  
}

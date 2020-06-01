import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form;
  error: string;
  form_iterator = [
    { control: 'username', type: 'text', placeholder: 'Usuario', label: 'usuario' },
    { control: 'password', type: 'password', placeholder: 'Contraseña', label: 'Contraseña' }
  ]

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { 
    this.form = this.formBuilder.group({
      username: '',
      password: '',
    });
    console.log(this.form);
  }

  ngOnInit(): void {
  }

  login(credentials) {
    this.authService.login(credentials).subscribe(
      res => {
        this.authService.setSession(res)
        this.router.navigate(['dashboard'])
      },
      error => {
        console.log(error)
        this.error = 'Usuario y/o contraseña invalidos.'
      }
    );
  }
  
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators } from '@angular/forms';
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
    {
      control: 'username', type: 'text', placeholder: 'Usuario', label: 'usuario',
      icon: 'person', error: 'Ingrese el nombre de usuario'
    },
    {
      control: 'password', type: 'password', placeholder: 'Contraseña', label: 'Contraseña',
      icon: 'lock', error: 'Ingrese la contraseña'
    }
  ]

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { 
    this.form = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
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

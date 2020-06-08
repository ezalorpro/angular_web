import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form;
  error;
  form_iterator = [
    {
      control: 'username', type: 'text', placeholder: 'Usuario', label: 'usuario',
      icon: 'person_outline', error: 'Ingrese el nombre de usuario'
    },
    {
      control: 'password', type: 'password', placeholder: 'Contraseña', label: 'Contraseña',
      icon: 'lock_outline', error: 'Ingrese la contraseña'
    }
  ]

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialogRef: MatDialogRef<LoginComponent>
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  login(credentials) {
    this.authService.login(credentials)
    this.authService.error_message.subscribe(
      error => {
        this.error = error
        console.log(error)
        console.log(this.error)
      }
    )
  }

  onClose() {
    this.dialogRef.close();
  }
  
}

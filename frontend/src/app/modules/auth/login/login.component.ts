import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form;
  error;
  login_subscription: Subscription;
  error_subscription: Subscription;
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
    this.login_subscription = this.authService.login(credentials)
    this.error_subscription = this.authService.error_message.subscribe(
      error => {
        this.error = error
      }
    )
  }

  onClose() {
    this.dialogRef.close();
    this.authService.redirect_url = null
  }

  ngOnDestroy() {
    if (this.login_subscription) {
      this.login_subscription.unsubscribe();
    }

    if (this.error_subscription) {
      this.error_subscription.unsubscribe();
    }
  }
  
}

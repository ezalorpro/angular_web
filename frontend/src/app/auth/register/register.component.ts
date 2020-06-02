import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthDialogService } from '../auth-dialog.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form;
  error: string;
  errors_messages = {
    username: 'Ingrese un nombre de usuario de almenos 4 caracteres',
    email: 'Correo no valido',
    password: 'Ingrese una contraseña de almenos 6 caracteres',
    password2: 'Las contraseñas deben coincidir'
  }
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authDialog: AuthDialogService
  ) {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      first_name: '',
      last_name: '',
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]]
    }, { validators: this.equalPassword})
   }

  ngOnInit(): void {
  }

  equalPassword(formGroup: AbstractControl) {
    let pass = formGroup.get('password').value;
    let pass2 = formGroup.get('password2').value;
    console.log(formGroup)
    if (pass !== pass2) {
      formGroup.get('password2').setErrors({ nomatch: true })
    } else {
      formGroup.get('password2').setErrors(null)
    }
    
    return pass === pass2
  }

  register(data) {
    return this.authService.register(data).subscribe(
      res => {
        this.router.navigate([res['redirect']])
        setTimeout(() => {
          this.authDialog.loginDialog();
        }, 3500);
    },
      error => {
        console.log(error)
        this.error = error.error.message;
    });
  }

}

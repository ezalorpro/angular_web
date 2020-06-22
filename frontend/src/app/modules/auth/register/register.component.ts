import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthDialogService } from '../auth-dialog.service';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [
    trigger(
      'registerAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('200ms', style({ opacity: 0 }))
      ])
    ]
    )
  ]
})
export class RegisterComponent implements OnInit {

  form;
  error: string;
  register_subscription: Subscription;
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

    if (pass !== pass2) {
      formGroup.get('password2').setErrors({ nomatch: true })
    } else {
      formGroup.get('password2').setErrors(null)
    }
    
    return pass === pass2
  }

  register(data) {
    this.register_subscription = this.authService.register(data).subscribe(
      res => {
        this.router.navigate([res['redirect']])
        setTimeout(() => {
          this.authDialog.loginDialogOpen();
        }, 3500);
    },
      error => {
        this.error = error.error.message;
    });
  }

  ngOnDestroy() {
    if (this.register_subscription) {
      this.register_subscription.unsubscribe()
    }
  }

}

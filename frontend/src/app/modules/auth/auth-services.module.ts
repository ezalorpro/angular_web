import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthDialogService } from './auth-dialog.service';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth-interceptor.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]  
})
export class AuthServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthServicesModule,
      providers: [
        AuthService,
        AuthDialogService,
        AuthGuardService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true
        }
      ]
    };
  }
}

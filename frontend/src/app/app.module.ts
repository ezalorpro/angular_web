import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './components/home/home.component';
import { GenericModule } from './modules/generic/generic.module';
import { PokemonDialogComponent } from './components/pokemon-dialog/pokemon-dialog.component';
import { HighlightCardDirective } from './directives/highlight-card.directive';
import { PokemonTypesDirective } from './components/pokemon-dialog/pokemon-types.directive';
import { AuthInterceptorService } from './modules/auth/auth-interceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    PokemonDialogComponent,
    HighlightCardDirective,
    PokemonTypesDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    GenericModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

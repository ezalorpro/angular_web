import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { RestService } from './services/rest.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from './modules/auth/auth.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './components/home/home.component';
import { ProfileModule } from './modules/profile/profile.module';
import { GenericModule } from './modules/generic/generic.module';
import { ScrollService } from './components/dashboard/scroll.service';
import { ModalDialogService } from './services/modal-dialog.service';
import { PokemonDialogComponent } from './components/pokemon-dialog/pokemon-dialog.component';
import { HighlightCardDirective } from './directives/highlight-card.directive';
import { PokemonTypesDirective } from './components/pokemon-dialog/pokemon-types.directive';
import { AuthServicesModule } from './modules/auth/auth-services.module';


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
    AuthServicesModule.forRoot(),
    FlexLayoutModule,
    GenericModule
  ],
  providers: [RestService, ScrollService, ModalDialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }

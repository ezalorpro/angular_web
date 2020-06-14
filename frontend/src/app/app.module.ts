import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { RestService } from './services/rest.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './components/home/home.component';
import { ProfileModule } from './profile/profile.module';
import { GenericModule } from './generic/generic.module';
import { ScrollService } from './components/dashboard/scroll.service';
import { ModalDialogService } from './services/modal-dialog.service';
import { PokemonDialogComponent } from './components/pokemon-dialog/pokemon-dialog.component';
import { HighlightCardDirective } from './directives/highlight-card.directive';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    PokemonDialogComponent,
    HighlightCardDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    AuthModule,
    FlexLayoutModule,
    ProfileModule,
    GenericModule
  ],
  providers: [RestService, ScrollService, ModalDialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }

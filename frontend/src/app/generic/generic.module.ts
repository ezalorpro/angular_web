import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ButtonLabelComponent } from './buttom-label/button-label.component';



@NgModule({
  declarations: [
    SidenavComponent,
    ToolbarComponent,
    ButtonLabelComponent
  ],
  exports: [
    SidenavComponent,
    ToolbarComponent,
    ButtonLabelComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule
  ]
})
export class GenericModule { }

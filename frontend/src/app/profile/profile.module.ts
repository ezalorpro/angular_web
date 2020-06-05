import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';



@NgModule({
  declarations: [ProfileViewComponent, ProfileEditComponent],
  imports: [
    CommonModule
  ]
})
export class ProfileModule { }

import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { AuthDialogService } from 'src/app/modules/auth/auth-dialog.service';
import { MediaObserver } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() drawer: MatSidenav;

  constructor(
    public authService: AuthService,
    public authDialog: AuthDialogService,
    public media: MediaObserver
  ) { }

  ngOnInit(): void {
  }

  onClick() {
    this.drawer.toggle()
  }

  login() {
    this.authDialog.loginDialogOpen()
  }

}

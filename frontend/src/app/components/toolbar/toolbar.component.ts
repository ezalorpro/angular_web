import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthDialogService } from 'src/app/auth/auth-dialog.service';
import { MediaObserver } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
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

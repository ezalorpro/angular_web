import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { AuthDialogService } from 'src/app/modules/auth/auth-dialog.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public authDialog: AuthDialogService
  ) { }

  ngOnInit(): void {
  }

}

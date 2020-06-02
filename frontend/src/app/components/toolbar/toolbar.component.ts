import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthDialogService } from 'src/app/auth/auth-dialog.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public authDialog: AuthDialogService
  ) { }

  ngOnInit(): void {
  }

}

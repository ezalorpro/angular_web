import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  loggedIn: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedIn = this.authService.isLoggedIn()
  }

  logout() {
    this.loggedIn = false;
    this.authService.logout()
  }

}

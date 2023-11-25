import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.onLogout();
  }

  onLogout(): void {
    // Clear the access token from localStorage
    localStorage.removeItem('access_token');

    // Optionally, clear other stored information or perform additional logout tasks

    // Navigate to the login page or any other page you want after logout
    this.router.navigate(['']);
  }
}

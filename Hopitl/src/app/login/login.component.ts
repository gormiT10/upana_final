import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentialesLogin = {
    correo: '',
    contrasena: '',
  };

  // W0OmmI4t test@gmail.com

  constructor(private authService: AuthService, private router: Router) {}

  loginCredentialsRequest() {
    this.authService.login(this.credentialesLogin).subscribe(
      (response) => {
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          this.router.navigate(['/Rclientes']);
        } else {
          console.log('no autorizado');
          this.router.navigate(['']);
        }
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }
}

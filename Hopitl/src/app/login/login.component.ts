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
    // objeto que se guardará en nuestro array de objetos "carritoData"
    console.log(this.credentialesLogin);

    // Make the login API call
    this.authService.login(this.credentialesLogin).subscribe(
      (response) => {
        console.log('respuesta:', response);

        if (response.access_token) {
          console.log(response.correo);
          this.router.navigate(['/Rclientes']);
        }
      },
      (error) => {
        console.error('Login failed:', error);
        // Handle the error as needed
      }
    );
  }
}

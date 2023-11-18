import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-rclientes',
  templateUrl: './rclientes.component.html',
  styleUrls: ['./rclientes.component.css']
})
export class RclientesComponent {
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.getPacientesData().subscribe(
      (data) => {
        console.log('Datos:', data);
        // Manejar los datos recibidos según sea necesario
      },
      (error) => {
        console.error('Error:', error);
        // Manejar errores
      }
    );
  }
  
}

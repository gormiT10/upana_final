import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agregar-usuario',
  templateUrl: './agregar-usuario.component.html',
  styleUrls: ['./agregar-usuario.component.css'],
})
export class AgregarUsuarioComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  usuarios: any[] = [];

  esteUsuario = {
    es_admin: false,
    nombre: '',
    correo: '',
    contrasena: '',
    especialidad: '',
    horario_laboral: '',
    puesto: '',
  };

  registrarUsuario() {
    // objeto que se guardará en nuestro array de objetos "carritoData"
    console.log(this.esteUsuario);

    // Make the login API call
    this.authService.registrarUsurio(this.esteUsuario).subscribe(
      (response) => {
        console.log('respuesta:', response);
        this.router.navigate(['/admins']);
      },
      (error) => {
        console.error('Login failed:', error);
        // Handle the error as needed
      }
    );
  }
}

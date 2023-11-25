// formulario-registro.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-formulario-registro',
  templateUrl: './formulario-registro.component.html',
  styleUrls: ['./formulario-registro.component.css'],
})
export class FormularioRegistroComponent {
  especialistasData: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  nuevoPaciente = {
    nombre: '',
    edad : '',
    especialistas: '',
    telefono: '',
    genero: '',
    direccion: '',
    dpi: '',
  };

  registrarPaciente() {
    // Make the login API call
    this.authService.registrarpacientes(this.nuevoPaciente).subscribe(
      (response) => {
        console.log('respuesta:', response);
        this.router.navigate(['/Rclientes']);
      },
      (error) => {
        console.error('error:', error);
        // Handle the error as needed
      }
    );
  }

  ngOnInit() {
    if (!localStorage['access_token']) {
      this.router.navigate(['']);
    }

    // Llamada a tu servicio para realizar la solicitud GET en el inicio del componente
    this.authService.getEspecialistas().subscribe(
      (response) => {
        console.log('Datos obtenidos con éxito:', response);
        this.especialistasData = response;

        // Puedes manejar la respuesta según tus necesidades
      },
      (error) => {
        console.error('Error al obtener datos:', error);
      }
    );
  }
}

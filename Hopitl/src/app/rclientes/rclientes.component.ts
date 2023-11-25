// rclientes.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-rclientes',
  templateUrl: './rclientes.component.html',
  styleUrls: ['./rclientes.component.css'],
})
export class RclientesComponent implements OnInit {
  pacientesData: any[] = [];
  pacienteBuscadoData: any[] = [];
  error: any;

  paciente = {
    nombre: '',
  };

  constructor(private router: Router, private authService: AuthService) {}

  buscarPaciente() {
    this.authService.BuscarUnPaciente(this.paciente).subscribe(
      (response) => {
        console.log('respuesta:', response);
        this.pacienteBuscadoData = response;
      },
      (error) => {
        console.error('error:', error);
        // Handle the error as needed
      }
    );
  }

  // acciones a realizarse cuando la pagina es renderizada
  ngOnInit(): void {
    this.obtenerPacientes();
  }

  // metodo para jalar los pacientes no atendidos de la base de datos
  obtenerPacientes() {
    this.authService.listarPacientes().subscribe(
      (data) => {
        this.pacientesData = data;
      },
      (error) => {
        this.error = error;
        console.error('Error:', error);
      }
    );
  }

  // Método para dirigir al formulario de registro
  irAFormulario() {
    this.router.navigate(['/formulario-registro']);
  }
}

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
  error: any;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.obtenerPacientes();
  }

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

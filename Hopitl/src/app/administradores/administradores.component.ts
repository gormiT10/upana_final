import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css'],
})
export class AdministradoresComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  usuarios: any[] = [];
  error: any;

  ngOnInit(): void {
    this.obtenerEspecialistas();
  }

  obtenerEspecialistas() {
    this.authService.listaAdministradores().subscribe(
      (data) => {
        console.log('Datos:', data);
        this.usuarios = data;
      },
      (error) => {
        this.error = error;
        console.error('Error:', error);
      }
    );
  }
}

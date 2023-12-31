import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-rdoctores',
  templateUrl: './rdoctores.component.html',
  styleUrls: ['./rdoctores.component.css'],
})
export class RdoctoresComponent {
  pacientesData: any[] = [];
  error: any;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.obtenerPacientesAsignados();
  }

  obtenerPacientesAsignados() {
    this.authService.obtenerPacientesAsignados().subscribe(
      (data) => {
        this.pacientesData = data;
        console.log('Datos:', data);
      },
      (error) => {
        this.router.navigate(['/Rclientes']);
      }
    );
  }
}

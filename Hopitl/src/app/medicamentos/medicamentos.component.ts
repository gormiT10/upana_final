import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.component.html',
  styleUrls: ['./medicamentos.component.css'],
})
export class MedicamentosComponent {
  constructor(private router: Router, private authService: AuthService) {}

  pacientesData: any[] = [];
  error: any;
  ngOnInit(): void {
    this.obtenerPacientesEnSala();
  }

  obtenerPacientesEnSala() {
    this.authService.pacientesEnFarmacia().subscribe(
      (data) => {
        this.pacientesData = data;
      },
      (error) => {
        this.error = error;
        console.error('Error:', error);
      }
    );
  }
}

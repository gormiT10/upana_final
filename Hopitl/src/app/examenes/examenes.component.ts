import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.component.html',
  styleUrls: ['./examenes.component.css'],
})
export class ExamenesComponent {
  pacientesData: any[] = [];
  error: any;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.obtenerPacientesConExamenes();
  }

  obtenerPacientesConExamenes() {
    this.authService.obtenerPacientesConExamenes().subscribe(
      (data) => {
        this.pacientesData = data;
      },
      (error) => {
        this.error = error;
        console.error('Error:', error);
        this.router.navigate(['/Rclientes']);
      }
    );
  }
}

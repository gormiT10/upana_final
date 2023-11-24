import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paciente-en-consulta',
  templateUrl: './paciente-en-consulta.component.html',
  styleUrls: ['./paciente-en-consulta.component.css'],
})
export class PacienteEnConsultaComponent {
  pacienteId!: number;
  selectedExamenes: string[] = [];
  examenCompletado: any = [{}];
  pacienteData: any = {};
  anamnesis: any = {
    consulta: '',
    peso: '',
    altura: '',
    examenes: [] as string[],
  };

  enviarAnamnesis(): void {
    const pacienteId = this.pacienteId; // Replace with the actual patient ID

    this.authService.pacienteAnamnesis(this.anamnesis, pacienteId).subscribe(
      (response) => {
        console.log('anamnesis sent successfully:', response);

        // this.router.navigate(['/Rclientes']);
      },
      (error) => {
        console.error('Error editing patient:', error);
      }
    );
  }

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const pacienteIdParam = params.get('paciente_id');
      if (pacienteIdParam !== null) {
        this.pacienteId = +pacienteIdParam;
        this.fetchPacienteData();
      } else {
        // Handle the case where paciente_id is null
        console.error('Paciente ID is null');
      }
      this.loadData();
    });
  }

  loadData() {
    // Example usage of the service method
    // Replace with the actual patient ID

    this.authService.verPacienteConResultados(this.pacienteId).subscribe(
      (response) => {
        this.examenCompletado = response;
        console.log(this.examenCompletado);
        // Handle the response data as needed
      },
      (error) => {
        console.error('GET request failed', error);
      }
    );
  }

  fetchPacienteData(): void {
    this.authService.verPacienteEnConsulta(this.pacienteId).subscribe(
      (data) => {
        console.log(data);
        this.pacienteData = data;
        // Handle the response data as needed
      },
      (error) => {
        console.error('Error fetching paciente data:', error);
        // Handle errors as needed
      }
    );
  }

  mandarALaboratorio() {
    this.router.navigate(['/Examenes']);
  }
}

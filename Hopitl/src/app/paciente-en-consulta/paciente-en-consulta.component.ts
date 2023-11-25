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
    antecedentes: '',
    alergias: false,
  };

  // metodo para mandar la anamnesis del paciente
  enviarAnamnesis(): void {
    const pacienteId = this.pacienteId; // Replace with the actual patient ID

    this.authService.pacienteAnamnesis(this.anamnesis, pacienteId).subscribe(
      (response) => {
        console.log('enviada:', response);

        // this.router.navigate(['/Rclientes']);
      },
      (error) => {
        console.error('error enviando la anamnesis:', error);
      }
    );
  }

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // informacion a cargar cuando se caraga la pagina
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const pacienteIdParam = params.get('paciente_id');
      if (pacienteIdParam !== null) {
        this.pacienteId = +pacienteIdParam;
        this.obtenerInformacionDelPaciente();
      } else {
        // Handle the case where paciente_id is null
        console.error('Paciente ID is null');
      }
      this.loadData();
    });
  }

  // funcion que se mostrara si algun examen ya esta completo
  loadData() {
    this.authService.verPacienteConResultados(this.pacienteId).subscribe(
      (response) => {
        this.examenCompletado = response;

        // Handle the response data as needed
      },
      (error) => {
        console.error('GET request failed', error);
      }
    );
  }

  // funcion que hace la get request
  obtenerInformacionDelPaciente(): void {
    this.authService.verPacienteEnConsulta(this.pacienteId).subscribe(
      (data) => {
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
    this.router.navigate(['/Rdoctores']);
  }

  mandarAdiagnosticoYreceta() {
    this.router.navigate(['especialista/receta/', this.pacienteId]);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-paciente-en-laboratorio',
  templateUrl: './paciente-en-laboratorio.component.html',
  styleUrls: ['./paciente-en-laboratorio.component.css'],
})
export class PacienteEnLaboratorioComponent {
  pacienteData: any = [{}];
  pacienteId!: number;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Llamada a tu servicio para realizar la solicitud GET en el inicio del componente

    this.route.paramMap.subscribe((params) => {
      const pacienteIdParam = params.get('paciente_id');
      if (pacienteIdParam !== null) {
        this.pacienteId = +pacienteIdParam;
        this.fetchPacienteData();
      } else {
        // Handle the case where paciente_id is null
        console.error('Paciente ID is null');
      }
    });
  }

  fetchPacienteData(): void {
    this.authService.verPacienteEnLaboratorio(this.pacienteId).subscribe(
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

  test(examen_id: any, examen_nombre: any) {
    this.router.navigate(['examen/completado', examen_id, examen_nombre]);
  }
}

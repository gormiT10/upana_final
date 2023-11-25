import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-eliminar-paciente',
  templateUrl: './eliminar-paciente.component.html',
  styleUrls: ['./eliminar-paciente.component.css'],
})
export class EliminarPacienteComponent {
  constructor(
    private AuthService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  pacienteId!: number;
  pacienteData: any = {};

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
    this.AuthService.irApaciente(this.pacienteId).subscribe(
      (data) => {
        console.log(data);
        this.pacienteData = data;

        // try with 2 especialis

        // Handle the response data as needed
      },
      (error) => {
        console.error('Error fetching paciente data:', error);
        // Handle errors as needed
      }
    );
  }

  deletePaciente(pacienteId: number): void {
    this.AuthService.deletePaciente(pacienteId).subscribe(
      (response) => {
        console.log('Paciente deleted successfully:', response);
        // Handle the response or perform any additional logic
        this.router.navigate(['Rclientes']);
      },
      (error) => {
        console.error('Error deleting paciente:', error);
        // Handle errors as needed
      }
    );
  }

  cancelarEliminacion() {
    // Assuming pacienteData contains the necessary properties, including 'id'
    const pacienteId = this.pacienteData.id;

    // Navigate to the '/editar/paciente/:paciente_id' route with the paciente_id parameter
    this.router.navigate(['/buscar/paciente/', pacienteId]);
  }
}

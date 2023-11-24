import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-detalles-del-paciente',
  templateUrl: './detalles-del-paciente.component.html',
  styleUrls: ['./detalles-del-paciente.component.css'],
})
export class DetallesDelPacienteComponent implements OnInit {
  pacienteId!: number;
  pacienteData: any = {}; // Adjust the type based on the expected response
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
    });
  }

  fetchPacienteData(): void {
    this.authService.irApaciente(this.pacienteId).subscribe(
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

  irAEditar() {
    // Assuming pacienteData contains the necessary properties, including 'id'
    const pacienteId = this.pacienteData.id;

    // Navigate to the '/editar/paciente/:paciente_id' route with the paciente_id parameter
    this.router.navigate(['/editar/paciente', pacienteId]);
  }

  irAEliminar() {
    // Assuming pacienteData contains the necessary properties, including 'id'
    const pacienteId = this.pacienteData.id;

    // Navigate to the '/editar/paciente/:paciente_id' route with the paciente_id parameter
    this.router.navigate(['/eliminar/paciente', pacienteId]);
  }

  regresar() {
    // Assuming pacienteData contains the necessary properties, including 'id'

    // Navigate to the '/editar/paciente/:paciente_id' route with the paciente_id parameter
    this.router.navigate(['Rclientes']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-paciente',
  templateUrl: './editar-paciente.component.html',
  styleUrls: ['./editar-paciente.component.css'],
})
export class EditarPacienteComponent implements OnInit {
  especialistasData: any[] = [];
  pacienteData: any = {};
  pacienteId!: number;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  nuevoPaciente = {
    nombre: '',
    especialistas: '',
  };

  ngOnInit() {
    // Llamada a tu servicio para realizar la solicitud GET en el inicio del componente
    this.authService.getEspecialistasData().subscribe(
      (response) => {
        console.log('Datos obtenidos con éxito:', response);
        this.especialistasData = response;
        // Puedes manejar la respuesta según tus necesidades
      },
      (error) => {
        console.error('Error al obtener datos:', error);
      }
    );

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
        this.nuevoPaciente.nombre = this.pacienteData.nombre;

        // try with 2 especialistas
        this.nuevoPaciente.especialistas =
          this.pacienteData.especialistas.join(', ');

        // Handle the response data as needed
      },
      (error) => {
        console.error('Error fetching paciente data:', error);
        // Handle errors as needed
      }
    );
  }

  editarPaciente(): void {
    const editarPaciente = {
      nombre: this.nuevoPaciente.nombre,
      especialistas: this.nuevoPaciente.especialistas,
    };
    const pacienteId = this.pacienteId; // Replace with the actual patient ID

    this.authService.editarElPaciente(editarPaciente, pacienteId).subscribe(
      (response) => {
        console.log('Patient edited successfully:', response);
        this.router.navigate(['/Rclientes']);
      },
      (error) => {
        console.error('Error editing patient:', error);
      }
    );
  }

  cancelarEdicion() {
    // Assuming pacienteData contains the necessary properties, including 'id'
    const pacienteId = this.pacienteData.id;

    // Navigate to the '/editar/paciente/:paciente_id' route with the paciente_id parameter
    this.router.navigate(['/buscar/paciente/', pacienteId]);
  }
}

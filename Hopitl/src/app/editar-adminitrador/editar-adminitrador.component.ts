import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-adminitrador',
  templateUrl: './editar-adminitrador.component.html',
  styleUrls: ['./editar-adminitrador.component.css'],
})
export class EditarAdminitradorComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  usuarios: any[] = [];

  esteUsuario = {
    es_admin: false,
    nombre: '',
    correo: '',
    contrasena: '',
    especialidad: '',
    horario_laboral: '',
    puesto: '',
  };

  error: any;
  usuarioID!: number;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const pacienteIdParam = params.get('usuario_id');
      if (pacienteIdParam !== null) {
        this.usuarioID = +pacienteIdParam;
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

    this.authService.informacionDelUsuario(this.usuarioID).subscribe(
      (response) => {
        this.esteUsuario.es_admin = response.es_admin;
        this.esteUsuario.nombre = response.nombre;
        this.esteUsuario.correo = response.correo;
        this.esteUsuario.especialidad = response.especialidad;
        this.esteUsuario.horario_laboral = response.horario_laboral;
        this.esteUsuario.puesto = response.puesto;
        // Handle the response data as needed
      },
      (error) => {
        console.error('GET request failed', error);
      }
    );
  }

  editarUsuario(): void {
    this.authService
      .editarElUsuario(this.esteUsuario, this.usuarioID)
      .subscribe(
        (response) => {
          console.log('Patient edited successfully:', response);
          this.router.navigate(['/admins']);
        },
        (error) => {
          console.error('Error editing patient:', error);
        }
      );
  }
}

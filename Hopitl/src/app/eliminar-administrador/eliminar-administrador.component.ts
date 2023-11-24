import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-eliminar-administrador',
  templateUrl: './eliminar-administrador.component.html',
  styleUrls: ['./eliminar-administrador.component.css'],
})
export class EliminarAdministradorComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  esteUsuario = {
    es_admin: false,
    nombre: '',
    correo: '',
    contrasena: '',
    especialidad: '',
    horario_laboral: '',
    puesto: '',
    id: 0,
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
        this.esteUsuario.id = response.id;
        // Handle the response data as needed
      },
      (error) => {
        console.error('GET request failed', error);
      }
    );
  }

  borrarUsuario(usuario_id: number): void {
    this.authService.eliminarUsuario(this.usuarioID).subscribe(
      (response) => {
        console.log('Paciente deleted successfully:', response);
        // Handle the response or perform any additional logic
        this.router.navigate(['/admins']);
      },
      (error) => {
        console.error('Error deleting paciente:', error);
        // Handle errors as needed
      }
    );
  }
}

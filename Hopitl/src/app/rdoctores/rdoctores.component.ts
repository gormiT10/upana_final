import { Component } from '@angular/core';

@Component({
  selector: 'app-rdoctores',
  templateUrl: './rdoctores.component.html',
  styleUrls: ['./rdoctores.component.css']
})
export class RdoctoresComponent {

  doctor = {
    nombreCompleto: '',
    especialidad: '',
    numeroColegiado: '',
    direccion: '',
    telefono: '',
    horarioAtencion: ''
  };

  onSubmit() {
    // Aquí puedes enviar los datos del doctor a tu servicio o hacer lo que necesites.
    console.log('Doctor registrado:', this.doctor);

  }
}
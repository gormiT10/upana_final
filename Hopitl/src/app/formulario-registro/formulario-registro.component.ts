// formulario-registro.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-formulario-registro',
  templateUrl: './formulario-registro.component.html',
  styleUrls: ['./formulario-registro.component.css'],
})
export class FormularioRegistroComponent {
  formulario: FormGroup;
  especialistasData: any[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      especialistas: ['', Validators.required],
      proceso: ['', Validators.required],
      atendido: [false],
    });
  }

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
  }

  registrarPaciente() {
    if (this.formulario.valid) {
      const nuevoPaciente = this.formulario.value;
      console.log(this.formulario.value);
      // Llamada al servicio para almacenar el nuevo paciente en el backend
      this.authService.registrarpacientes(nuevoPaciente).subscribe(
        (response) => {
          console.log('Nuevo paciente registrado con éxito:', response);
          // Puedes redirigir a la lista de pacientes después de registrar uno nuevo
        },
        (error) => {
          console.error('Error al registrar nuevo paciente:', error);
        }
      );
    }
  }
}

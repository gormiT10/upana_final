import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-paciente-en-farmacia',
  templateUrl: './paciente-en-farmacia.component.html',
  styleUrls: ['./paciente-en-farmacia.component.css'],
})
export class PacienteEnFarmaciaComponent {
  pacienteId!: number;
  receta!: any;
  factura!: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  medicamentosEnFarmacia: any;

  medicamentosListados!: string[];
  cantidadDelMedicamento!: number[];
  precioDelMedicamento!: number[];
  medicamentos: any[] = [];
  nombreDelMedicamentoSeleccionado!: string;
  error: any;
  mostrarPopup = false;
  cantidad!: number;
  precio!: number;

  diagnostico!: string;

  ngOnInit(): void {
    this.receta = {
      informacion: '',
    };

    this.medicamentosListados = [];
    this.cantidadDelMedicamento = [];
    this.precioDelMedicamento = [];

    this.factura = {
      producto: this.medicamentosListados,
      cantidad: this.cantidadDelMedicamento,
      precio: this.precioDelMedicamento,
    };
    // Get the pacienteId from the URL parameters
    this.route.params.subscribe((params) => {
      this.pacienteId = +params['paciente_id']; // Convert to number
    });
    this.fetchData();
    this.obtenerMedicamentos();
  }

  obtenerMedicamentos() {
    this.authService.obtenerMedicamentos().subscribe(
      (data) => {
        this.medicamentosEnFarmacia = data;
        console.log('Datos:', data);
      },
      (error) => {
        this.error = error;
        console.error('Error:', error);
      }
    );
  }
  agregar(medicamento: string, precio: number) {
    this.nombreDelMedicamentoSeleccionado = medicamento;
    this.precio = precio;
    this.mostrarPopup = !this.mostrarPopup;
  }

  agregarAlaReceta() {
    this.medicamentosListados.push(this.nombreDelMedicamentoSeleccionado);
    this.cantidadDelMedicamento.push(this.cantidad);
    this.precioDelMedicamento.push(this.precio);

    console.log(this.factura);
    this.precio = 0;
    this.cantidad = 0;
    this.cancelar();
  }

  cancelar() {
    this.mostrarPopup = !this.mostrarPopup;
  }

  fetchData() {
    if (this.pacienteId) {
      this.authService.pacientesPagandoEnFarmacia(this.pacienteId).subscribe(
        (data) => {
          console.log('Data:', data);
          this.receta = data;
          // Handle the data as needed
        },
        (error) => {
          console.error('Error:', error);
          // Handle errors
        }
      );
    } else {
      console.error('Paciente ID not found in the URL.');
      // Handle the case where the pacienteId is not found in the URL
    }
  }

  generarFactura() {
    // Use the EnviarDatosDeFactura method from the service

    // Replace with the actual patient ID

    this.authService
      .EnviarDatosDeFactura(this.factura, this.pacienteId)
      .subscribe(
        (response) => {
          console.log('Success:', response);
          this.router.navigate(['farmacia/factura/', this.pacienteId]);
          // Handle the response as needed
        },
        (error) => {
          console.error('Error:', error);
          // Handle the error as needed
        }
      );
  }
}

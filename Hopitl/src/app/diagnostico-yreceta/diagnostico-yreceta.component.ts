import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-diagnostico-yreceta',
  templateUrl: './diagnostico-yreceta.component.html',
  styleUrls: ['./diagnostico-yreceta.component.css'],
})
export class DiagnosticoYrecetaComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  medicamentosListados!: string[];
  cantidadDelMedicamento!: string[];
  dosisDelMedicamento!: string[];
  medicamentos: any[] = [];
  nombreDelMedicamentoSeleccionado!: string;
  error: any;
  mostrarPopup = false;
  cantidad!: string;
  dosis!: string;
  pacienteID!: number;
  receta: any;
  diagnostico!: string;

  ngOnInit(): void {
    this.obtenerMedicamentos();
    this.medicamentosListados = [];
    this.cantidadDelMedicamento = [];
    this.dosisDelMedicamento = [];

    this.receta = {
      diagnostico: this.diagnostico,
      medicamento: this.medicamentosListados,
      cantidad: this.cantidadDelMedicamento,
      dosis: this.dosisDelMedicamento,
    };
  }

  agregar(medicamento: string) {
    this.mostrarPopup = !this.mostrarPopup;
    this.nombreDelMedicamentoSeleccionado = medicamento;
  }

  agregarAlaReceta() {
    this.receta.diagnostico = this.diagnostico;
    this.medicamentosListados.push(this.nombreDelMedicamentoSeleccionado);
    this.cantidadDelMedicamento.push(this.cantidad);
    this.dosisDelMedicamento.push(this.dosis);

    this.cantidad = '';
    this.dosis = '';
    this.cancelar();
  }

  cancelar() {
    this.mostrarPopup = !this.mostrarPopup;
  }

  obtenerMedicamentos() {
    this.authService.obtenerMedicamentos().subscribe(
      (data) => {
        this.medicamentos = data;
        console.log('Datos:', data);
      },
      (error) => {
        this.error = error;
        console.error('Error:', error);
      }
    );

    this.route.paramMap.subscribe((params) => {
      const pacienteIdParam = params.get('paciente_id');
      if (pacienteIdParam !== null) {
        this.pacienteID = +pacienteIdParam;
      } else {
        // Handle the case where paciente_id is null
        console.error('Paciente ID is null');
      }
    });
  }

  enviarReceta() {
    // Replace with the actual patient ID

    this.authService
      .enviarDiagnosticoReceta(this.receta, this.pacienteID)
      .subscribe(
        (response) => {
          console.log('Response:', response);
          this.router.navigate(['/Medicamentos']);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-enviar-resultados-examenes',
  templateUrl: './enviar-resultados-examenes.component.html',
  styleUrls: ['./enviar-resultados-examenes.component.css'],
})
export class EnviarResultadosExamenesComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  examenCompletado: any = [{}];
  examen_id!: number;
  nombre!: string;
  examenInfo = {
    nombre: '',
    id: 0,
    status: '',
    hemoglobina: '',
    hematocrito: '',
    aspecto: '',
    color: '',
  };

  test() {
    console.log(this.examenInfo);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const examenIdParam = params.get('examen_id');
      const examenNombre = params.get('nombre');
      if (examenIdParam !== null && examenNombre !== null) {
        this.examen_id = +examenIdParam;
        this.nombre = examenNombre;
        this.authService
          .verExamenesAcompletar(this.examen_id, this.nombre)
          .subscribe(
            (data) => {
              console.log('Exam data:', data);
              this.examenCompletado = data;
              console.log(this.examenCompletado, 'rh');
              this.examenInfo.nombre = data.nombre;
              this.examenInfo.id = data.id;
            },
            (error) => {
              console.error('Error fetching exam data:', error);
            }
          );
      } else {
        console.error('Examen ID or nombre is null');
      }
    });
  }

  onSubmit() {
    // Example usage of the service method

    this.authService
      .pacienteExamenesyResultados(this.examenInfo, this.nombre, this.examen_id)
      .subscribe(
        (response) => {
          console.log('POST request successful', response);
          this.router.navigate(['/Examenes']);
        },
        (error) => {
          console.error('POST request failed', error);
        }
      );
  }

  irAreceta() {
    this.router.navigate([
      '/especialista/receta/',
      this.examenCompletado.paciente_id,
    ]);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mostrar-factura',
  templateUrl: './mostrar-factura.component.html',
  styleUrls: ['./mostrar-factura.component.css'],
})
export class MostrarFacturaComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  pacienteId!: number;
  factura = {
    subtotal: '',
    total: 0,
  };
  error: any;

  ngOnInit(): void {
    // Get the pacienteId from the URL parameters
    this.route.params.subscribe((params) => {
      this.pacienteId = +params['paciente_id']; // Convert to number
    });

    this.obtenerFactura();
  }

  obtenerFactura() {
    this.authService.mostrarFactura(this.pacienteId).subscribe(
      (data) => {
        this.factura.subtotal = data.subtotal;
        this.factura.total = data.total;
        console.log(data);
      },
      (error) => {
        this.error = error;
        console.error('Error:', error);
      }
    );
  }

  finalizar() {
    this.router.navigate(['Rclientes']);
  }
}

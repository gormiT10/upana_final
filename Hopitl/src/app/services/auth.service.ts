// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000/api'; // Replace with your actual API URL

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { correo: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  listarPacientes(): Observable<any> {
    const accessToken = localStorage.getItem('access_token');
    console.log(accessToken);

    if (!accessToken) {
      // Handle the case when the token is not available
      this.router.navigate(['/Login']);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
    // Replace 'your-endpoint' with the actual endpoint you want to request data from
    return this.http.get(`${this.apiUrl}/pacientes`, { headers });
  }

  getEspecialistasData(): Observable<any> {
    // Replace 'your-endpoint' with the actual endpoint you want to request data from
    return this.http.get(`${this.apiUrl}/especialistas/activos`);
  }

  obtenerPacientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pacientes`);
  }

  obtenerPacientesEnSala(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/soyespecialista`);
  }

  obtenerPacientesConExamenes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/laboratorio`);
  }

  registrarpacientes(nuevopaciente: {
    nombre: string;
    especialistas: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/pacientes`, nuevopaciente);
  }

  registrarUsurio(nuevoUsuario: {
    es_admin: boolean;
    nombre: string;
    correo: string;
    contrasena: string;
    especialidad: string;
    horario_laboral: string;
    puesto: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/especialistas/activos`, nuevoUsuario);
  }

  pacienteAnamnesis(
    info_consulta: {
      consulta: string;
      peso: string;
      altura: string;
      examenes: Array<string>;
    },
    paciente_id: number
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/especialista/paciente/${paciente_id}`,
      info_consulta
    );
  }

  pacienteExamenesyResultados(
    info_examen: {
      nombre: string;
      hemoglobina: string;
      hematocrito: string;
      aspecto: string;
      color: string;
      id: number;
    },
    nombre: string,
    examen_id: number
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/examen/completado/${nombre}/${examen_id}`,
      info_examen
    );
  }

  irApaciente(pacienteId: number): Observable<any> {
    const url = `${this.apiUrl}/buscar/paciente/${pacienteId}`;
    return this.http.get(url);
  }

  verPacienteEnConsulta(pacienteId: number): Observable<any> {
    const url = `${this.apiUrl}/especialista/paciente/${pacienteId}`;
    return this.http.get(url);
  }

  enviarDiagnosticoReceta(
    informacion: {
      diagnostico: string;
      medicamento: string[];
      cantidad: string[];
      dosis: string[];
    },
    paciente_id: number
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/especialistas/receta/${paciente_id}`,
      informacion
    );
  }

  EnviarDatosDeFactura(
    informacion: {
      producto: string[];
      cantidad: number[];
      precio: number[];
    },
    paciente_id: number
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/farmacia/pagar/paciente/${paciente_id}`,
      informacion
    );
  }

  mostrarFactura(pacienteId: number): Observable<any> {
    const url = `${this.apiUrl}/farmacia/factura/${pacienteId}`;
    return this.http.get(url);
  }

  verPacienteConResultados(pacienteId: number): Observable<any> {
    const url = `${this.apiUrl}/especialistas/receta/${pacienteId}`;
    return this.http.get(url);
  }

  verExamenesAcompletar(examen_id: number, nombre: string): Observable<any> {
    const url = `${this.apiUrl}/examen/completado/${nombre}/${examen_id}`;
    return this.http.get(url);
  }

  verPacienteEnLaboratorio(pacienteId: number): Observable<any> {
    const url = `${this.apiUrl}/laboratorio/examenes/${pacienteId}`;
    return this.http.get(url);
  }

  informacionDelUsuario(usuario_id: number): Observable<any> {
    const url = `${this.apiUrl}/editar/usuario/${usuario_id}`;
    return this.http.get(url);
  }

  editarElPaciente(
    editarPaciente: { nombre: string; especialistas: string },
    pacienteId: number
  ): Observable<any> {
    const url = `${this.apiUrl}/buscar/paciente/${pacienteId}`;
    return this.http.put(url, editarPaciente);
  }

  editarElUsuario(
    editarPaciente: {
      es_admin: boolean;
      nombre: string;
      correo: string;
      contrasena: string;
      especialidad: string;
      horario_laboral: string;
      puesto: string;
    },
    usuario_id: number
  ): Observable<any> {
    const url = `${this.apiUrl}/editar/usuario/${usuario_id}`;
    return this.http.put(url, editarPaciente);
  }

  obtenerMedicamentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/farmacia/productos`);
  }

  pacientesEnFarmacia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/farmacia`);
  }

  listaAdministradores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/especialistas/activos`);
  }

  pacientesPagandoEnFarmacia(paciente_id: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/farmacia/pagar/paciente/${paciente_id}`
    );
  }

  deletePaciente(pacienteId: number): Observable<any> {
    const url = `${this.apiUrl}/buscar/paciente/${pacienteId}`;
    return this.http.delete(url);
  }

  eliminarUsuario(usuario_id: number): Observable<any> {
    const url = `${this.apiUrl}/editar/usuario/${usuario_id}`;
    return this.http.delete(url);
  }
}

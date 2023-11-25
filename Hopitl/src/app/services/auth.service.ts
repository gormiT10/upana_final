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

  // request para obtener la lista de pacientes no atendidos
  listarPacientes(): Observable<any> {
    const accessToken = localStorage.getItem('access_token');

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

  // servicio para obtener el usuario logeado
  usarioLogeado(): Observable<any> {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      // Handle the case when the token is not available
      this.router.navigate(['/Login']);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
    // Replace 'your-endpoint' with the actual endpoint you want to request data from
    return this.http.get(`${this.apiUrl}/usuario/logeado`, { headers });
  }

  getUsuariosAdmin(): Observable<any> {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      // Handle the case when the token is not available
      this.router.navigate(['/Login']);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.apiUrl}/especialistas/activos`, { headers });
  }

  getEspecialistas(): Observable<any> {
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

    return this.http.get(`${this.apiUrl}/nuestros/especialistas`, { headers });
  }

  // FALTA
  obtenerPacientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pacientes`);
  }

  // request para obtener los pacientes asignados a un especialista especifico
  obtenerPacientesAsignados(): Observable<any[]> {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      // Handle the case when the token is not available
      this.router.navigate(['/Login']);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get<any[]>(`${this.apiUrl}/soyespecialista`, { headers });
  }

  obtenerPacientesConExamenes(): Observable<any[]> {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      // Handle the case when the token is not available
      this.router.navigate(['/Login']);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get<any[]>(`${this.apiUrl}/laboratorio`, { headers });
  }

  // request para registrar un paciente
  registrarpacientes(nuevopaciente: {
    nombre: string;
    especialistas: string;
    telefono: string;
    genero: string;
    dpi: string;
    direccion: string;
  }): Observable<any> {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      // Handle the case where the access token is not available
      console.error('no se encontro el access token');
      this.router.navigate(['/Login']);
      // You might want to redirect to the login page or handle the error in another way
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(`${this.apiUrl}/pacientes`, nuevopaciente, {
      headers,
    });
  }

  registrarUsurio(nuevoUsuario: {
    es_admin: boolean;
    nombre: string;
    contrasena: string;
    especialidad: string;
    horario_laboral: string;
    puesto: string;
  }): Observable<any> {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      // Handle the case where the access token is not available
      console.error('no se encontro el access token');
      this.router.navigate(['/Login']);
      // You might want to redirect to the login page or handle the error in another way
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.post(
      `${this.apiUrl}/especialistas/activos`,
      nuevoUsuario,
      { headers }
    );
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
    // mandando el json web token en le header
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(
      `${this.apiUrl}/especialista/paciente/${paciente_id}`,
      info_consulta,
      { headers }
    );
  }

  BuscarUnPaciente(nombre: { nombre: string }): Observable<any> {
    // mandando el json web token en le header
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(`${this.apiUrl}/buscar/paciente`, nombre, {
      headers,
    });
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
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(
      `${this.apiUrl}/examen/completado/${nombre}/${examen_id}`,
      info_examen,
      { headers }
    );
  }

  irApaciente(pacienteId: number): Observable<any> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    const url = `${this.apiUrl}/buscar/paciente/${pacienteId}`;
    return this.http.get(url, { headers });
  }

  // metodo que nos permitira obtener la informacion basica de un paciente
  verPacienteEnConsulta(pacienteId: number): Observable<any> {
    // jsonWebToken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    // url a mandar la request
    const url = `${this.apiUrl}/especialista/paciente/${pacienteId}`;

    // mandamos el header en la peticion
    return this.http.get(url, { headers });
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
    // jsonWebToken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.post(
      `${this.apiUrl}/especialistas/receta/${paciente_id}`,
      informacion,
      { headers }
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
    // jsonWebToken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    const url = `${this.apiUrl}/farmacia/factura/${pacienteId}`;
    return this.http.get(url, { headers });
  }

  nuevaConsulta(pacienteId: number): Observable<any> {
    // jsonWebToken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    const url = `${this.apiUrl}/nueva/consulta/${pacienteId}`;
    return this.http.get(url, { headers });
  }

  cancelarNuevaConsulta(pacienteId: number): Observable<any> {
    // jsonWebToken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    const url = `${this.apiUrl}/cancelar/nueva/consulta/${pacienteId}`;
    return this.http.get(url, { headers });
  }

  verPacienteConResultados(pacienteId: number): Observable<any> {
    // jsonWebToken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
    const url = `${this.apiUrl}/especialistas/receta/${pacienteId}`;
    return this.http.get(url, { headers });
  }

  verExamenesAcompletar(examen_id: number, nombre: string): Observable<any> {
    // jsonWebToken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    const url = `${this.apiUrl}/examen/completado/${nombre}/${examen_id}`;
    return this.http.get(url, { headers });
  }

  verPacienteEnLaboratorio(pacienteId: number): Observable<any> {
    // jsonWebToken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    const url = `${this.apiUrl}/laboratorio/examenes/${pacienteId}`;
    return this.http.get(url, { headers });
  }

  informacionDelUsuario(usuario_id: number): Observable<any> {
    // jsonWebToken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
    const url = `${this.apiUrl}/editar/usuario/${usuario_id}`;
    return this.http.get(url, { headers });
  }

  editarElPaciente(
    editarPaciente: {
      nombre: string;
      especialistas: string;
      telefono: string;
      genero: string;
      dpi: string;
      direccion: string;
    },
    pacienteId: number
  ): Observable<any> {
    // jsonWebToken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
    const url = `${this.apiUrl}/buscar/paciente/${pacienteId}`;
    return this.http.put(url, editarPaciente, { headers });
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
    // jsonWebToken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    const url = `${this.apiUrl}/editar/usuario/${usuario_id}`;
    return this.http.put(url, editarPaciente, { headers });
  }

  obtenerMedicamentos(): Observable<any[]> {
    // mandando el jsonwebtoken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/farmacia/productos`, {
      headers,
    });
  }

  pacientesEnFarmacia(): Observable<any[]> {
    // mandando el jsonwebtoken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get<any[]>(`${this.apiUrl}/farmacia`, { headers });
  }

  listaAdministradores(): Observable<any[]> {
    // mandando el jsonwebtoken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    return this.http.get<any[]>(`${this.apiUrl}/especialistas/activos`, {
      headers,
    });
  }

  pacientesPagandoEnFarmacia(paciente_id: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/farmacia/pagar/paciente/${paciente_id}`
    );
  }

  deletePaciente(pacienteId: number): Observable<any> {
    // mandando el jsonwebtoken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    const url = `${this.apiUrl}/buscar/paciente/${pacienteId}`;
    return this.http.delete(url, { headers });
  }

  eliminarUsuario(usuario_id: number): Observable<any> {
    // mandando el jsonwebtoken para validar la session
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      console.error('No se encontró el access token');
      this.router.navigate(['/Login']);
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    const url = `${this.apiUrl}/editar/usuario/${usuario_id}`;
    return this.http.delete(url, { headers });
  }
}

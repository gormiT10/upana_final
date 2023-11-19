// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000/api'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  login(credentials: { correo: string; contrasena: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  getPacientesData(): Observable<any> {
    // Replace 'your-endpoint' with the actual endpoint you want to request data from
    return this.http.get(`${this.apiUrl}/pacientes`);
  }

  getEspecialistasData(): Observable<any> {
    // Replace 'your-endpoint' with the actual endpoint you want to request data from
    return this.http.get(`${this.apiUrl}/especialistas/activos`);
  }

  obtenerPacientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pacientes`);
  }

  registrarpacientes(nuevopaciente: {
    nombre: string;
    especialistas: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/pacientes`, nuevopaciente);
  }
}

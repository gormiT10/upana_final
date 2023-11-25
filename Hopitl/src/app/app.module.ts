import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RclientesComponent } from './rclientes/rclientes.component';
import { RdoctoresComponent } from './rdoctores/rdoctores.component';
import { ExamenesComponent } from './examenes/examenes.component';
import { MedicamentosComponent } from './medicamentos/medicamentos.component';
import { RecetaComponent } from './receta/receta.component';

import { RouterModule, Routes } from '@angular/router';
import { FormularioRegistroComponent } from './formulario-registro/formulario-registro.component';
import { DetallesDelPacienteComponent } from './detalles-del-paciente/detalles-del-paciente.component';
import { EditarPacienteComponent } from './editar-paciente/editar-paciente.component';
import { EliminarPacienteComponent } from './eliminar-paciente/eliminar-paciente.component';
import { PacienteEnConsultaComponent } from './paciente-en-consulta/paciente-en-consulta.component';
import { PacienteEnLaboratorioComponent } from './paciente-en-laboratorio/paciente-en-laboratorio.component';
import { EnviarResultadosExamenesComponent } from './enviar-resultados-examenes/enviar-resultados-examenes.component';
import { InformacionDelExamenCompletadoComponent } from './informacion-del-examen-completado/informacion-del-examen-completado.component';
import { DiagnosticoYrecetaComponent } from './diagnostico-yreceta/diagnostico-yreceta.component';
import { PacienteEnFarmaciaComponent } from './paciente-en-farmacia/paciente-en-farmacia.component';
import { MostrarFacturaComponent } from './mostrar-factura/mostrar-factura.component';
import { AdministradoresComponent } from './administradores/administradores.component';
import { EditarAdminitradorComponent } from './editar-adminitrador/editar-adminitrador.component';
import { EliminarAdministradorComponent } from './eliminar-administrador/eliminar-administrador.component';
import { AgregarUsuarioComponent } from './agregar-usuario/agregar-usuario.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },

  {
    path: 'formulario-registro',
    component: FormularioRegistroComponent,
  },

  {
    path: 'editar/paciente/:paciente_id',
    component: EditarPacienteComponent,
  },

  {
    path: 'buscar/paciente/:paciente_id',
    component: DetallesDelPacienteComponent,
  },

  {
    path: 'eliminar/paciente/:paciente_id',
    component: EliminarPacienteComponent,
  },

  {
    path: 'especialista/paciente/:paciente_id',
    component: PacienteEnConsultaComponent,
  },

  {
    path: 'especialista/paciente/:paciente_id',
    component: PacienteEnConsultaComponent,
  },

  {
    path: 'laboratorio/examenes/:paciente_id',
    component: PacienteEnLaboratorioComponent,
  },
  {
    path: 'examen/completado/:nombre/:examen_id',
    component: EnviarResultadosExamenesComponent,
  },
  {
    path: 'examen/completado/:nombre/:examen_id',
    component: InformacionDelExamenCompletadoComponent,
  },

  {
    path: 'especialista/receta/:paciente_id',
    component: DiagnosticoYrecetaComponent,
  },

  {
    path: 'farmacia/pagar/paciente/:paciente_id',
    component: PacienteEnFarmaciaComponent,
  },
  {
    path: 'farmacia/factura/:paciente_id',
    component: MostrarFacturaComponent,
  },

  {
    path: 'Rclientes',
    component: RclientesComponent,
  },

  {
    path: 'Rdoctores',
    component: RdoctoresComponent,
  },

  {
    path: 'Examenes',
    component: ExamenesComponent,
  },

  {
    path: 'Medicamentos',
    component: MedicamentosComponent,
  },
  {
    path: 'Receta',
    component: RecetaComponent,
  },
  {
    path: 'admins',
    component: AdministradoresComponent,
  },
  {
    path: 'agregar/admins',
    component: AgregarUsuarioComponent,
  },
  {
    path: 'editar/usuario/:usuario_id',
    component: EditarAdminitradorComponent,
  },

  {
    path: 'eliminar/usuario/:usuario_id',
    component: EliminarAdministradorComponent,
  },

  {
    path: 'logout',
    component: LogoutComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RclientesComponent,
    RdoctoresComponent,
    ExamenesComponent,
    MedicamentosComponent,
    RecetaComponent,
    FormularioRegistroComponent,
    EditarPacienteComponent,
    EliminarPacienteComponent,
    PacienteEnConsultaComponent,
    PacienteEnLaboratorioComponent,
    EnviarResultadosExamenesComponent,
    InformacionDelExamenCompletadoComponent,
    DiagnosticoYrecetaComponent,
    PacienteEnFarmaciaComponent,
    MostrarFacturaComponent,
    AdministradoresComponent,
    EditarAdminitradorComponent,
    EliminarAdministradorComponent,
    AgregarUsuarioComponent,
    LogoutComponent,
    DetallesDelPacienteComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RdoctoresComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

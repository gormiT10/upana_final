import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RclientesComponent } from './rclientes/rclientes.component';
import { RdoctoresComponent } from './rdoctores/rdoctores.component';
import { ExamenesComponent } from './examenes/examenes.component';
import { MedicamentosComponent } from './medicamentos/medicamentos.component';
import { RecetaComponent } from './receta/receta.component';


import { RouterModule,Routes } from '@angular/router';

const routes: Routes = [
{
  path:'Login',
  component: LoginComponent
},
{
  path:'Rclientes',
  component: RclientesComponent
},
{
  path:'Rdoctores',
  component: RdoctoresComponent
},
{
  path:'Examenes',
  component: ExamenesComponent
},
{
  path:'Medicamentos',
  component: MedicamentosComponent
},
{
  path:'Receta',
  component: RecetaComponent
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
    RecetaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RdoctoresComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
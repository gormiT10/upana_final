import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RclientesComponent } from './rclientes/rclientes.component';
import { RdoctoresComponent } from './rdoctores/rdoctores.component';
import { ExamenesComponent } from './examenes/examenes.component';
import { MedicamentosComponent } from './medicamentos/medicamentos.component';
import { RecetaComponent } from './receta/receta.component';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
<<<<<<< HEAD
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


=======
  {
    path: 'Login',
    component: LoginComponent,
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
>>>>>>> 82ffbda50fb3196169bd142fe4f5eaa7c66ef58e
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
  ],
  imports: [
    BrowserModule,
<<<<<<< HEAD
    FormsModule,
    RouterModule.forRoot(routes)
=======
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
>>>>>>> 82ffbda50fb3196169bd142fe4f5eaa7c66ef58e
  ],
  exports: [
    RdoctoresComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

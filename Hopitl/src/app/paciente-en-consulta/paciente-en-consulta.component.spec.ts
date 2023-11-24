import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteEnConsultaComponent } from './paciente-en-consulta.component';

describe('PacienteEnConsultaComponent', () => {
  let component: PacienteEnConsultaComponent;
  let fixture: ComponentFixture<PacienteEnConsultaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PacienteEnConsultaComponent]
    });
    fixture = TestBed.createComponent(PacienteEnConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

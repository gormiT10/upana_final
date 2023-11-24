import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteEnLaboratorioComponent } from './paciente-en-laboratorio.component';

describe('PacienteEnLaboratorioComponent', () => {
  let component: PacienteEnLaboratorioComponent;
  let fixture: ComponentFixture<PacienteEnLaboratorioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PacienteEnLaboratorioComponent]
    });
    fixture = TestBed.createComponent(PacienteEnLaboratorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

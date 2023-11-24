import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesDelPacienteComponent } from './detalles-del-paciente.component';

describe('DetallesDelPacienteComponent', () => {
  let component: DetallesDelPacienteComponent;
  let fixture: ComponentFixture<DetallesDelPacienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetallesDelPacienteComponent]
    });
    fixture = TestBed.createComponent(DetallesDelPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

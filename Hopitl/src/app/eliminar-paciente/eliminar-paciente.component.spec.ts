import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarPacienteComponent } from './eliminar-paciente.component';

describe('EliminarPacienteComponent', () => {
  let component: EliminarPacienteComponent;
  let fixture: ComponentFixture<EliminarPacienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EliminarPacienteComponent]
    });
    fixture = TestBed.createComponent(EliminarPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

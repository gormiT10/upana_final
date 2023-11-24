import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteEnFarmaciaComponent } from './paciente-en-farmacia.component';

describe('PacienteEnFarmaciaComponent', () => {
  let component: PacienteEnFarmaciaComponent;
  let fixture: ComponentFixture<PacienteEnFarmaciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PacienteEnFarmaciaComponent]
    });
    fixture = TestBed.createComponent(PacienteEnFarmaciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

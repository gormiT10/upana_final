import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarResultadosExamenesComponent } from './enviar-resultados-examenes.component';

describe('EnviarResultadosExamenesComponent', () => {
  let component: EnviarResultadosExamenesComponent;
  let fixture: ComponentFixture<EnviarResultadosExamenesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnviarResultadosExamenesComponent]
    });
    fixture = TestBed.createComponent(EnviarResultadosExamenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

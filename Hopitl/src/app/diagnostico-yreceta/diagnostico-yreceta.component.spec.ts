import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticoYrecetaComponent } from './diagnostico-yreceta.component';

describe('DiagnosticoYrecetaComponent', () => {
  let component: DiagnosticoYrecetaComponent;
  let fixture: ComponentFixture<DiagnosticoYrecetaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiagnosticoYrecetaComponent]
    });
    fixture = TestBed.createComponent(DiagnosticoYrecetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionDelExamenCompletadoComponent } from './informacion-del-examen-completado.component';

describe('InformacionDelExamenCompletadoComponent', () => {
  let component: InformacionDelExamenCompletadoComponent;
  let fixture: ComponentFixture<InformacionDelExamenCompletadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformacionDelExamenCompletadoComponent]
    });
    fixture = TestBed.createComponent(InformacionDelExamenCompletadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

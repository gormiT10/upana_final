import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarAdministradorComponent } from './eliminar-administrador.component';

describe('EliminarAdministradorComponent', () => {
  let component: EliminarAdministradorComponent;
  let fixture: ComponentFixture<EliminarAdministradorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EliminarAdministradorComponent]
    });
    fixture = TestBed.createComponent(EliminarAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

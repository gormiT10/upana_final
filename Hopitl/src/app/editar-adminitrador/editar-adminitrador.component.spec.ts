import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAdminitradorComponent } from './editar-adminitrador.component';

describe('EditarAdminitradorComponent', () => {
  let component: EditarAdminitradorComponent;
  let fixture: ComponentFixture<EditarAdminitradorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarAdminitradorComponent]
    });
    fixture = TestBed.createComponent(EditarAdminitradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

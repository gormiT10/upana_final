import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdoctoresComponent } from './rdoctores.component';

describe('RdoctoresComponent', () => {
  let component: RdoctoresComponent;
  let fixture: ComponentFixture<RdoctoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RdoctoresComponent]
    });
    fixture = TestBed.createComponent(RdoctoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RclientesComponent } from './rclientes.component';

describe('RclientesComponent', () => {
  let component: RclientesComponent;
  let fixture: ComponentFixture<RclientesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RclientesComponent]
    });
    fixture = TestBed.createComponent(RclientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

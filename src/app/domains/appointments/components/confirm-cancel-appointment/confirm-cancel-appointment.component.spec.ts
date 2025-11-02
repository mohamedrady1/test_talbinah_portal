import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCancelAppointmentComponent } from './confirm-cancel-appointment.component';

describe('ConfirmCancelAppointmentComponent', () => {
  let component: ConfirmCancelAppointmentComponent;
  let fixture: ComponentFixture<ConfirmCancelAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmCancelAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmCancelAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

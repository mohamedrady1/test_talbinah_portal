import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgentAppointmentFloatingWindowComponent } from './urgent-appointment-floating-window.component';

describe('UrgentAppointmentFloatingWindowComponent', () => {
  let component: UrgentAppointmentFloatingWindowComponent;
  let fixture: ComponentFixture<UrgentAppointmentFloatingWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrgentAppointmentFloatingWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrgentAppointmentFloatingWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrgentAppointmentLayoutComponent } from './urgent-appointment-layout.component';

describe('UrgentAppointmentLayoutComponent', () => {
  let component: UrgentAppointmentLayoutComponent;
  let fixture: ComponentFixture<UrgentAppointmentLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrgentAppointmentLayoutComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UrgentAppointmentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

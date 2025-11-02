import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCardForBookingComponent } from './doctor-card-for-booking.component';

describe('DoctorCardForBookingComponent', () => {
  let component: DoctorCardForBookingComponent;
  let fixture: ComponentFixture<DoctorCardForBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorCardForBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorCardForBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

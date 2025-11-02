import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationWithDoctorFormComponent } from './reservation-with-doctor-form.component';

describe('ReservationWithDoctorFormComponent', () => {
  let component: ReservationWithDoctorFormComponent;
  let fixture: ComponentFixture<ReservationWithDoctorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationWithDoctorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationWithDoctorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

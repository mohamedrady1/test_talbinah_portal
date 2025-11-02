import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCardForBookingSkeletonComponent } from './doctor-card-for-booking-skeleton.component';

describe('DoctorCardForBookingSkeletonComponent', () => {
  let component: DoctorCardForBookingSkeletonComponent;
  let fixture: ComponentFixture<DoctorCardForBookingSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorCardForBookingSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorCardForBookingSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

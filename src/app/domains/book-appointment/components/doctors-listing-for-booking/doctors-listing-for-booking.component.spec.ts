import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsListingForBookingComponent } from './doctors-listing-for-booking.component';

describe('DoctorsListingForBookingComponent', () => {
  let component: DoctorsListingForBookingComponent;
  let fixture: ComponentFixture<DoctorsListingForBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsListingForBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsListingForBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

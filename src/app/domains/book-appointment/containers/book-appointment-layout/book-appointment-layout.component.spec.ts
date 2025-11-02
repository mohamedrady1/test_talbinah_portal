import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAppointmentLayoutComponent } from './book-appointment-layout.component';

describe('BookAppointmentLayoutComponent', () => {
  let component: BookAppointmentLayoutComponent;
  let fixture: ComponentFixture<BookAppointmentLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookAppointmentLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookAppointmentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookUrgentAppointmentComponent } from './book-urgent-appointment.component';

describe('BookUrgentAppointmentComponent', () => {
  let component: BookUrgentAppointmentComponent;
  let fixture: ComponentFixture<BookUrgentAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookUrgentAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookUrgentAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

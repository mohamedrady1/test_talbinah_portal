import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentCancellationCardComponent } from './appointment-cancellation-card.component';

describe('AppointmentCancellationCardComponent', () => {
  let component: AppointmentCancellationCardComponent;
  let fixture: ComponentFixture<AppointmentCancellationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentCancellationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentCancellationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentPaymentCardComponent } from './appointment-payment-card.component';

describe('AppointmentPaymentCardComponent', () => {
  let component: AppointmentPaymentCardComponent;
  let fixture: ComponentFixture<AppointmentPaymentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentPaymentCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentPaymentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

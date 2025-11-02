import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDetailsCardComponent } from './appointment-details-card.component';

describe('AppointmentDetailsCardComponent', () => {
  let component: AppointmentDetailsCardComponent;
  let fixture: ComponentFixture<AppointmentDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentDetailsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

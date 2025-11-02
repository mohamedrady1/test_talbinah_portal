import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSessionHistoryCardComponent } from './appointment-session-history-card.component';

describe('AppointmentSessionHistoryCardComponent', () => {
  let component: AppointmentSessionHistoryCardComponent;
  let fixture: ComponentFixture<AppointmentSessionHistoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentSessionHistoryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentSessionHistoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

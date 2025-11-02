import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpMethodSelectionComponent } from './otp-method-selection.component';

describe('OtpMethodSelectionComponent', () => {
  let component: OtpMethodSelectionComponent;
  let fixture: ComponentFixture<OtpMethodSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpMethodSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpMethodSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

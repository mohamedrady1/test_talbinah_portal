import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernmentAgencyVerificationComponent } from './government-agency-verification.component';

describe('GovernmentAgencyVerificationComponent', () => {
  let component: GovernmentAgencyVerificationComponent;
  let fixture: ComponentFixture<GovernmentAgencyVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovernmentAgencyVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GovernmentAgencyVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

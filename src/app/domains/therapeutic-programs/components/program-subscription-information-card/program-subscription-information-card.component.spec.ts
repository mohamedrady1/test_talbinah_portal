import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramSubscriptionInformationCardComponent } from './program-subscription-information-card.component';

describe('ProgramSubscriptionInformationCardComponent', () => {
  let component: ProgramSubscriptionInformationCardComponent;
  let fixture: ComponentFixture<ProgramSubscriptionInformationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramSubscriptionInformationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramSubscriptionInformationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

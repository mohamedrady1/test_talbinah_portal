import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramSubscriptionPopupComponent } from './program-subscription-popup.component';

describe('ProgramSubscriptionPopupComponent', () => {
  let component: ProgramSubscriptionPopupComponent;
  let fixture: ComponentFixture<ProgramSubscriptionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramSubscriptionPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramSubscriptionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSubscriptionCardComponent } from './add-new-subscription-card.component';

describe('AddNewSubscriptionCardComponent', () => {
  let component: AddNewSubscriptionCardComponent;
  let fixture: ComponentFixture<AddNewSubscriptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewSubscriptionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewSubscriptionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

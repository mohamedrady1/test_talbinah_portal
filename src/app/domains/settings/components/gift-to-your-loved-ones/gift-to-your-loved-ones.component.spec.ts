import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftToYourLovedOnesComponent } from './gift-to-your-loved-ones.component';

describe('GiftToYourLovedOnesComponent', () => {
  let component: GiftToYourLovedOnesComponent;
  let fixture: ComponentFixture<GiftToYourLovedOnesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiftToYourLovedOnesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftToYourLovedOnesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

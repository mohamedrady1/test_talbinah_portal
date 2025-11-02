import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateYourCompatibilityComponent } from './rate-your-compatibility.component';

describe('RateYourCompatibilityComponent', () => {
  let component: RateYourCompatibilityComponent;
  let fixture: ComponentFixture<RateYourCompatibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateYourCompatibilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateYourCompatibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

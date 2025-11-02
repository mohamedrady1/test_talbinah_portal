import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountCodeCardComponent } from './discount-code-card.component';

describe('DiscountCodeCardComponent', () => {
  let component: DiscountCodeCardComponent;
  let fixture: ComponentFixture<DiscountCodeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountCodeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountCodeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

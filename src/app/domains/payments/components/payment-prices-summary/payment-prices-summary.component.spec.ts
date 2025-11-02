import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPricesSummaryComponent } from './payment-prices-summary.component';

describe('PaymentPricesSummaryComponent', () => {
  let component: PaymentPricesSummaryComponent;
  let fixture: ComponentFixture<PaymentPricesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentPricesSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentPricesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

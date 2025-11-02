import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalRateCardComponent } from './global-rate-card.component';

describe('GlobalRateCardComponent', () => {
  let component: GlobalRateCardComponent;
  let fixture: ComponentFixture<GlobalRateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalRateCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalRateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

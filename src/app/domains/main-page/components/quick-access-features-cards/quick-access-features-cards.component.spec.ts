import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAccessFeaturesCardsComponent } from './quick-access-features-cards.component';

describe('QuickAccessFeaturesCardsComponent', () => {
  let component: QuickAccessFeaturesCardsComponent;
  let fixture: ComponentFixture<QuickAccessFeaturesCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickAccessFeaturesCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickAccessFeaturesCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

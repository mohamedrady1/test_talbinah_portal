import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepressiveDisorderScaleCardComponent } from './depressive-disorder-scale-card.component';

describe('DepressiveDisorderScaleCardComponent', () => {
  let component: DepressiveDisorderScaleCardComponent;
  let fixture: ComponentFixture<DepressiveDisorderScaleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepressiveDisorderScaleCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepressiveDisorderScaleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalHealthScaleCardComponent } from './mental-health-scale-card.component';

describe('MentalHealthScaleCardComponent', () => {
  let component: MentalHealthScaleCardComponent;
  let fixture: ComponentFixture<MentalHealthScaleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalHealthScaleCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalHealthScaleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

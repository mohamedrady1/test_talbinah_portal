import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeScaleCalenderShimmerComponent } from './time-scale-calender-shimmer.component';

describe('TimeScaleCalenderShimmerComponent', () => {
  let component: TimeScaleCalenderShimmerComponent;
  let fixture: ComponentFixture<TimeScaleCalenderShimmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeScaleCalenderShimmerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeScaleCalenderShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

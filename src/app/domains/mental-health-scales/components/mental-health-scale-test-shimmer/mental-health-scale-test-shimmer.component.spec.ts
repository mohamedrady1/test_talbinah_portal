import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalHealthScaleTestShimmerComponent } from './mental-health-scale-test-shimmer.component';

describe('MentalHealthScaleTestShimmerComponent', () => {
  let component: MentalHealthScaleTestShimmerComponent;
  let fixture: ComponentFixture<MentalHealthScaleTestShimmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalHealthScaleTestShimmerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalHealthScaleTestShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

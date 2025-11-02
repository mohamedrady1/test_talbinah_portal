import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentalHealthScaleListShimmerComponent } from './mental-health-scale-list-shimmer.component';

describe('MentalHealthScaleListShimmerComponent', () => {
  let component: MentalHealthScaleListShimmerComponent;
  let fixture: ComponentFixture<MentalHealthScaleListShimmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentalHealthScaleListShimmerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentalHealthScaleListShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

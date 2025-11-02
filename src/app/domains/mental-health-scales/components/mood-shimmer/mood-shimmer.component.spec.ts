import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodShimmerComponent } from './mood-shimmer.component';

describe('MoodShimmerComponent', () => {
  let component: MoodShimmerComponent;
  let fixture: ComponentFixture<MoodShimmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodShimmerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

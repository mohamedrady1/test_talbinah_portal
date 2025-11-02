import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorySliderCardComponent } from './story-slider-card.component';

describe('StorySliderCardComponent', () => {
  let component: StorySliderCardComponent;
  let fixture: ComponentFixture<StorySliderCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorySliderCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorySliderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

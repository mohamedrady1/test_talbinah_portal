import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalStorySliderComponent } from './global-story-slider.component';

describe('GlobalStorySliderComponent', () => {
  let component: GlobalStorySliderComponent;
  let fixture: ComponentFixture<GlobalStorySliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalStorySliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalStorySliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

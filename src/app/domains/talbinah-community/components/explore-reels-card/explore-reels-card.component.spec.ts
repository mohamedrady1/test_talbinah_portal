import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreReelsCardComponent } from './explore-reels-card.component';

describe('ExploreReelsCardComponent', () => {
  let component: ExploreReelsCardComponent;
  let fixture: ComponentFixture<ExploreReelsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreReelsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreReelsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

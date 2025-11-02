import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreReelsComponent } from './explore-reels.component';

describe('ExploreReelsComponent', () => {
  let component: ExploreReelsComponent;
  let fixture: ComponentFixture<ExploreReelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreReelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreReelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

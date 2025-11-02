import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastSkeletonComponent } from './podcast-skeleton.component';

describe('PodcastSkeletonComponent', () => {
  let component: PodcastSkeletonComponent;
  let fixture: ComponentFixture<PodcastSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PodcastSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodcastSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastMediaPlayerComponent } from './podcast-media-player.component';

describe('PodcastMediaPlayerComponent', () => {
  let component: PodcastMediaPlayerComponent;
  let fixture: ComponentFixture<PodcastMediaPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PodcastMediaPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodcastMediaPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

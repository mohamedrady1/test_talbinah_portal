import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastAudioPlayerComponent } from './podcast-audio-player.component';

describe('PodcastAudioPlayerComponent', () => {
  let component: PodcastAudioPlayerComponent;
  let fixture: ComponentFixture<PodcastAudioPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PodcastAudioPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodcastAudioPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

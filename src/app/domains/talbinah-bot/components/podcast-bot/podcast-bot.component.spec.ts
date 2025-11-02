import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastBotComponent } from './podcast-bot.component';

describe('PodcastBotComponent', () => {
  let component: PodcastBotComponent;
  let fixture: ComponentFixture<PodcastBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PodcastBotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodcastBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

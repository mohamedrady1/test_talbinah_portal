import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodcastCardForMeetingChatComponent } from './podcast-card-for-meeting-chat.component';

describe('PodcastCardForMeetingChatComponent', () => {
  let component: PodcastCardForMeetingChatComponent;
  let fixture: ComponentFixture<PodcastCardForMeetingChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PodcastCardForMeetingChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodcastCardForMeetingChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

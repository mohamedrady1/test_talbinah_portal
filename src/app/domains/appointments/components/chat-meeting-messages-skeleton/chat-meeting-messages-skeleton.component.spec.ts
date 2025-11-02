import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMeetingMessagesSkeletonComponent } from './chat-meeting-messages-skeleton.component';

describe('ChatMeetingMessagesSkeletonComponent', () => {
  let component: ChatMeetingMessagesSkeletonComponent;
  let fixture: ComponentFixture<ChatMeetingMessagesSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMeetingMessagesSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatMeetingMessagesSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

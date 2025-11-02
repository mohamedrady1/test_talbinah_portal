import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMeetingMessagesComponent } from './chat-meeting-messages.component';

describe('ChatMeetingMessagesComponent', () => {
  let component: ChatMeetingMessagesComponent;
  let fixture: ComponentFixture<ChatMeetingMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMeetingMessagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatMeetingMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

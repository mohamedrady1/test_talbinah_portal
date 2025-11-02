import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageVoiceComponent } from './chat-message-voice.component';

describe('ChatMessageVoiceComponent', () => {
  let component: ChatMessageVoiceComponent;
  let fixture: ComponentFixture<ChatMessageVoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMessageVoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatMessageVoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

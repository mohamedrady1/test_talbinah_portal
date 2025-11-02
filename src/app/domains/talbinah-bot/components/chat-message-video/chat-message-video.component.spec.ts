import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageVideoComponent } from './chat-message-video.component';

describe('ChatMessageVideoComponent', () => {
  let component: ChatMessageVideoComponent;
  let fixture: ComponentFixture<ChatMessageVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMessageVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatMessageVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

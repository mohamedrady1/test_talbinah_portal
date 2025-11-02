import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageImageComponent } from './chat-message-image.component';

describe('ChatMessageImageComponent', () => {
  let component: ChatMessageImageComponent;
  let fixture: ComponentFixture<ChatMessageImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMessageImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatMessageImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

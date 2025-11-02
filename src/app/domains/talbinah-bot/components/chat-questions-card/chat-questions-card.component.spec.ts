import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatQuestionsCardComponent } from './chat-questions-card.component';

describe('ChatQuestionsCardComponent', () => {
  let component: ChatQuestionsCardComponent;
  let fixture: ComponentFixture<ChatQuestionsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatQuestionsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatQuestionsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

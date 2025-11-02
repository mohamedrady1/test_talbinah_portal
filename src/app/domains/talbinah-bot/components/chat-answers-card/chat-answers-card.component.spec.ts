import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAnswersCardComponent } from './chat-answers-card.component';

describe('ChatAnswersCardComponent', () => {
  let component: ChatAnswersCardComponent;
  let fixture: ComponentFixture<ChatAnswersCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatAnswersCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatAnswersCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

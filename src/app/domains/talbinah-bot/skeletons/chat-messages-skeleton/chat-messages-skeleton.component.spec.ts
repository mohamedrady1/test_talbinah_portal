import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessagesSkeletonComponent } from './chat-messages-skeleton.component';

describe('ChatMessagesSkeletonComponent', () => {
  let component: ChatMessagesSkeletonComponent;
  let fixture: ComponentFixture<ChatMessagesSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatMessagesSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatMessagesSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

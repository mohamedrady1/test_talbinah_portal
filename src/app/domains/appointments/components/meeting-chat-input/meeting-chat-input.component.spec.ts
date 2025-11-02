import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingChatInputComponent } from './meeting-chat-input.component';

describe('MeetingChatInputComponent', () => {
  let component: MeetingChatInputComponent;
  let fixture: ComponentFixture<MeetingChatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingChatInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingChatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

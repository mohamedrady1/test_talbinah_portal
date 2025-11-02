import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountCardForMeetingChatComponent } from './discount-card-for-meeting-chat.component';

describe('DiscountCardForMeetingChatComponent', () => {
  let component: DiscountCardForMeetingChatComponent;
  let fixture: ComponentFixture<DiscountCardForMeetingChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountCardForMeetingChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountCardForMeetingChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

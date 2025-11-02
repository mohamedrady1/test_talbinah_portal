import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSupportChatCardComponent } from './technical-support-chat-card.component';

describe('TechnicalSupportChatCardComponent', () => {
  let component: TechnicalSupportChatCardComponent;
  let fixture: ComponentFixture<TechnicalSupportChatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalSupportChatCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalSupportChatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

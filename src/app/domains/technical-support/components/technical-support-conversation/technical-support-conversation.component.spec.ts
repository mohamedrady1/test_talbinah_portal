import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSupportConversationComponent } from './technical-support-conversation.component';

describe('TechnicalSupportConversationComponent', () => {
  let component: TechnicalSupportConversationComponent;
  let fixture: ComponentFixture<TechnicalSupportConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalSupportConversationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalSupportConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseSupportConversationComponent } from './close-support-conversation.component';

describe('CloseSupportConversationComponent', () => {
  let component: CloseSupportConversationComponent;
  let fixture: ComponentFixture<CloseSupportConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseSupportConversationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseSupportConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

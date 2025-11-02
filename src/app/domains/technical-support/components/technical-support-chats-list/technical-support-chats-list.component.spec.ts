import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSupportChatsListComponent } from './technical-support-chats-list.component';

describe('TechnicalSupportChatsListComponent', () => {
  let component: TechnicalSupportChatsListComponent;
  let fixture: ComponentFixture<TechnicalSupportChatsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalSupportChatsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalSupportChatsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSupportChatsListSkeletonComponent } from './technical-support-chats-list-skeleton.component';

describe('TechnicalSupportChatsListSkeletonComponent', () => {
  let component: TechnicalSupportChatsListSkeletonComponent;
  let fixture: ComponentFixture<TechnicalSupportChatsListSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalSupportChatsListSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalSupportChatsListSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

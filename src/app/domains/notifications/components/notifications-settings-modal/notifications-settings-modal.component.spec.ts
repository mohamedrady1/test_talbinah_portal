import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsSettingsModalComponent } from './notifications-settings-modal.component';

describe('NotificationsSettingsModalComponent', () => {
  let component: NotificationsSettingsModalComponent;
  let fixture: ComponentFixture<NotificationsSettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsSettingsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNotificationCardComponent } from './header-notification-card.component';

describe('HeaderNotificationCardComponent', () => {
  let component: HeaderNotificationCardComponent;
  let fixture: ComponentFixture<HeaderNotificationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderNotificationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderNotificationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

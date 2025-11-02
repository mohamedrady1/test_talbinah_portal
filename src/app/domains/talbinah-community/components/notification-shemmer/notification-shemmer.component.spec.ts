import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationShemmerComponent } from './notification-shemmer.component';

describe('NotificationShemmerComponent', () => {
  let component: NotificationShemmerComponent;
  let fixture: ComponentFixture<NotificationShemmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationShemmerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationShemmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

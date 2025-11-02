import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyNotificationsComponent } from './society-notifications.component';

describe('SocietyNotificationsComponent', () => {
  let component: SocietyNotificationsComponent;
  let fixture: ComponentFixture<SocietyNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocietyNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocietyNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

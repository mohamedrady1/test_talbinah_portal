import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPsychologicalSocietyNotificationCardComponent } from './my-psychological-society-notification-card.component';

describe('MyPsychologicalSocietyNotificationCardComponent', () => {
  let component: MyPsychologicalSocietyNotificationCardComponent;
  let fixture: ComponentFixture<MyPsychologicalSocietyNotificationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPsychologicalSocietyNotificationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPsychologicalSocietyNotificationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

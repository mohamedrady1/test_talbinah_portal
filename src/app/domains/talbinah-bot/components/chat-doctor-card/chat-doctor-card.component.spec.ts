import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDoctorCardComponent } from './chat-doctor-card.component';

describe('ChatDoctorCardComponent', () => {
  let component: ChatDoctorCardComponent;
  let fixture: ComponentFixture<ChatDoctorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatDoctorCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatDoctorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

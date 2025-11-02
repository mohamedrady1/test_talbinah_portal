import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionWithDoctorComponent } from './session-with-doctor.component';

describe('SessionWithDoctorComponent', () => {
  let component: SessionWithDoctorComponent;
  let fixture: ComponentFixture<SessionWithDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionWithDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionWithDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

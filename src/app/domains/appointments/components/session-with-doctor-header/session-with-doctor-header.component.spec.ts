import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionWithDoctorHeaderComponent } from './session-with-doctor-header.component';

describe('SessionWithDoctorHeaderComponent', () => {
  let component: SessionWithDoctorHeaderComponent;
  let fixture: ComponentFixture<SessionWithDoctorHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionWithDoctorHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionWithDoctorHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

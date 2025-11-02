import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentCardSkeletonComponent } from './appointment-card-skeleton.component';

describe('AppointmentCardSkeletonComponent', () => {
  let component: AppointmentCardSkeletonComponent;
  let fixture: ComponentFixture<AppointmentCardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentCardSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentCardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

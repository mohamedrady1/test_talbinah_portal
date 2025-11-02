import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCardForDetailsComponent } from './doctor-card-for-details.component';

describe('DoctorCardForDetailsComponent', () => {
  let component: DoctorCardForDetailsComponent;
  let fixture: ComponentFixture<DoctorCardForDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorCardForDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorCardForDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

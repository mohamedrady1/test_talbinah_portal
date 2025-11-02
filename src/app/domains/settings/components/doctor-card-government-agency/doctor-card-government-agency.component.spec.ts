import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCardGovernmentAgencyComponent } from './doctor-card-government-agency.component';

describe('DoctorCardGovernmentAgencyComponent', () => {
  let component: DoctorCardGovernmentAgencyComponent;
  let fixture: ComponentFixture<DoctorCardGovernmentAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorCardGovernmentAgencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorCardGovernmentAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

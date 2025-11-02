import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorBioComponent } from './doctor-bio.component';

describe('DoctorBioComponent', () => {
  let component: DoctorBioComponent;
  let fixture: ComponentFixture<DoctorBioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorBioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorBioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

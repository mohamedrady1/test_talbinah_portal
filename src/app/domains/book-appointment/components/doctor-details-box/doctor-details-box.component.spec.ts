import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDetailsBoxComponent } from './doctor-details-box.component';

describe('DoctorDetailsBoxComponent', () => {
  let component: DoctorDetailsBoxComponent;
  let fixture: ComponentFixture<DoctorDetailsBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorDetailsBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorDetailsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

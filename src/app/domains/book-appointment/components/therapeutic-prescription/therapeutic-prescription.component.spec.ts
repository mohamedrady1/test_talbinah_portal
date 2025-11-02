import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapeuticPrescriptionComponent } from './therapeutic-prescription.component';

describe('TherapeuticPrescriptionComponent', () => {
  let component: TherapeuticPrescriptionComponent;
  let fixture: ComponentFixture<TherapeuticPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapeuticPrescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapeuticPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

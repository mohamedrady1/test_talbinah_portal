import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalIdVerificationComponent } from './national-id-verification.component';

describe('NationalIdVerificationComponent', () => {
  let component: NationalIdVerificationComponent;
  let fixture: ComponentFixture<NationalIdVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NationalIdVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NationalIdVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

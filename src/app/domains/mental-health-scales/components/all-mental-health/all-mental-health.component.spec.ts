import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMentalHealthComponent } from './all-mental-health.component';

describe('AllMentalHealthComponent', () => {
  let component: AllMentalHealthComponent;
  let fixture: ComponentFixture<AllMentalHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllMentalHealthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMentalHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

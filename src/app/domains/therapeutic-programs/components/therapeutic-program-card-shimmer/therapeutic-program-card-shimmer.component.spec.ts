import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapeuticProgramCardShimmerComponent } from './therapeutic-program-card-shimmer.component';

describe('TherapeuticProgramCardShimmerComponent', () => {
  let component: TherapeuticProgramCardShimmerComponent;
  let fixture: ComponentFixture<TherapeuticProgramCardShimmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapeuticProgramCardShimmerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapeuticProgramCardShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

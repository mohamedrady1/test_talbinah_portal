import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTherapeuticProgramsComponent } from './all-therapeutic-programs.component';

describe('AllTherapeuticProgramsComponent', () => {
  let component: AllTherapeuticProgramsComponent;
  let fixture: ComponentFixture<AllTherapeuticProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTherapeuticProgramsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTherapeuticProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

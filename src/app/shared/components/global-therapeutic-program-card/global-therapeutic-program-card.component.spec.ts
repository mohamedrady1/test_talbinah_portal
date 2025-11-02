import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalTherapeuticProgramCardComponent } from './global-therapeutic-program-card.component';

describe('GlobalTherapeuticProgramCardComponent', () => {
  let component: GlobalTherapeuticProgramCardComponent;
  let fixture: ComponentFixture<GlobalTherapeuticProgramCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalTherapeuticProgramCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalTherapeuticProgramCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

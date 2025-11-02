import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapeuticProgramCardComponent } from './therapeutic-program-card.component';

describe('TherapeuticProgramCardComponent', () => {
  let component: TherapeuticProgramCardComponent;
  let fixture: ComponentFixture<TherapeuticProgramCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapeuticProgramCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapeuticProgramCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

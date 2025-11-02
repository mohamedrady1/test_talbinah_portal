import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsychologicalSocietyCardComponent } from './psychological-society-card.component';

describe('PsychologicalSocietyCardComponent', () => {
  let component: PsychologicalSocietyCardComponent;
  let fixture: ComponentFixture<PsychologicalSocietyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsychologicalSocietyCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsychologicalSocietyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

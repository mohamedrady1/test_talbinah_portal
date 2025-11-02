import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsychologicalSocietyCardShemmerComponent } from './psychological-society-card-shemmer.component';

describe('PsychologicalSocietyCardShemmerComponent', () => {
  let component: PsychologicalSocietyCardShemmerComponent;
  let fixture: ComponentFixture<PsychologicalSocietyCardShemmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsychologicalSocietyCardShemmerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsychologicalSocietyCardShemmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

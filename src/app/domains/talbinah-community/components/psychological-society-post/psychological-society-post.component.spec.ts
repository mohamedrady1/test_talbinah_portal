import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsychologicalSocietyPostComponent } from './psychological-society-post.component';

describe('PsychologicalSocietyPostComponent', () => {
  let component: PsychologicalSocietyPostComponent;
  let fixture: ComponentFixture<PsychologicalSocietyPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsychologicalSocietyPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsychologicalSocietyPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
